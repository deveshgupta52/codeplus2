const axios = require('axios');
const Question = require('../models/Question');

const languageMap = {
    54: 'cpp', 71: 'python', 62: 'java', 63: 'javascript'
};

const getFullCode = (driver, placeholder, source_code, langKey) => {
    const driverLines = driver.split('\n');
    const placeholderLineIndex = driverLines.findIndex(line => line.includes(placeholder));

    if (placeholderLineIndex === -1) {
        throw new Error('Server configuration error: Driver code is invalid or placeholder is missing.');
    }

    if (langKey === 'python') {
        const placeholderLine = driverLines[placeholderLineIndex];
        const placeholderIndentMatch = placeholderLine.match(/^(\s*)/);
        const placeholderIndent = placeholderIndentMatch ? placeholderIndentMatch[0] : '';
        const userLines = source_code.split('\n');
        const indentedUserCode = userLines.map(line => placeholderIndent + line).join('\n');
        
        let fullCode = driverLines.slice(0, placeholderLineIndex).join('\n') + '\n' +
                       indentedUserCode + '\n' +
                       driverLines.slice(placeholderLineIndex + 1).join('\n');
        
        // Remove the 'pass' statement if it's there and was indented by the placeholder
        fullCode = fullCode.replace(new RegExp('^' + placeholderIndent + 'pass *$', 'gm'), '');
        return fullCode;
    } else {
        return driver.replace(placeholder, source_code);
    }
};

const runSingleTestCase = async (apiKey, fullCode, language_id, stdin) => {
    try {
        const encodedSourceCode = Buffer.from(fullCode).toString('base64');
        const encodedStdin = Buffer.from(stdin || "").toString('base64');

        const response = await axios.post(
            "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=true",
            {
                source_code: encodedSourceCode,
                language_id: language_id,
                stdin: encodedStdin,
            },
            {
                headers: {
                    "content-type": "application/json",
                    "X-RapidAPI-Key": apiKey,
                    "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
                },
                timeout: 10000 // 10 second timeout
            }
        );

        const result = response.data;
        const stdout = result.stdout ? Buffer.from(result.stdout, 'base64').toString('utf-8') : null;
        const stderr = result.stderr ? Buffer.from(result.stderr, 'base64').toString('utf-8') : null;
        const compile_output = result.compile_output ? Buffer.from(result.compile_output, 'base64').toString('utf-8') : null;
        const message = result.message ? Buffer.from(result.message, 'base64').toString('utf-8') : null;
        
        return {
            status: result.status,
            stdout: stdout ? stdout.trim() : null,
            stderr: stderr ? stderr.trim() : null,
            compile_output: compile_output ? compile_output.trim() : null,
            message: message ? message.trim() : null,
            time: result.time,
            memory: result.memory,
        };

    } catch (err) {
        console.error("Judge0 API Error in runSingleTestCase:", err.response?.data || err.message || err);
        const statusCode = err.response?.status || 500;
        let statusDescription = "Internal Judge Error";
        let detailedError = "Failed to execute test case.";

        if (err.code === 'ECONNABORTED') {
            statusDescription = "Time Limit Exceeded";
            detailedError = "The code execution timed out.";
        } else if (err.response?.data) {
            const { message, stderr, compile_output, error } = err.response.data;
            if (error) { statusDescription = "API Error"; detailedError = error; }
            else if (compile_output) { statusDescription = "Compilation Error"; detailedError = Buffer.from(compile_output, 'base64').toString('utf-8'); }
            else if (stderr) { statusDescription = "Runtime Error"; detailedError = Buffer.from(stderr, 'base64').toString('utf-8'); }
            else if (message) { statusDescription = "Execution Error"; detailedError = message; }
        } else if (err.message) {
            detailedError = err.message;
        }

        return {
            status: { id: -1, description: statusDescription },
            stderr: detailedError,
            error: detailedError,
        };
    }
};


const runCode = async (req, res, next) => {
    const { source_code, language_id, questionId } = req.body;

    if (!source_code || language_id === undefined || !questionId) {
        return res.status(400).json({ error: 'Missing source_code, language_id, or questionId.' });
    }

    try {
        const question = await Question.findById(questionId).select('driverCode visibleTestCases');
        if (!question || !question.driverCode) {
            return res.status(404).json({ error: 'Question or driver code not found.' });
        }

        const langKey = languageMap[language_id];
        if (!langKey) {
            return res.status(400).json({ error: 'Unsupported language ID.' });
        }

        const driver = question.driverCode[langKey];
        if (!driver) {
             return res.status(404).json({ error: `Driver code for language "${langKey}" not found.` });
        }

        const userCodePlaceholder = { cpp: '// USER_CODE_HERE', python: '# USER_CODE_HERE', java: '// USER_CODE_HERE', javascript: '// USER_CODE_HERE' }[langKey];
        const fullCode = getFullCode(driver, userCodePlaceholder, source_code, langKey);

        const apiKey = process.env.JUDGE0_RAPIDAPI_KEY;
        if (!apiKey) {
             console.error("Judge0 RapidAPI Key not found in environment variables.");
             return res.status(500).json({ error: 'Server configuration error: API key missing.' });
        }

        if (!question.visibleTestCases || question.visibleTestCases.length === 0) {
            return res.status(200).json({
                message: "No visible test cases for this question. Use custom input or submit.",
                results: []
            });
        }
        
        const results = [];
        for (const testCase of question.visibleTestCases) {
            const result = await runSingleTestCase(apiKey, fullCode, language_id, testCase.input);
            results.push({
                ...result,
                input: testCase.input,
                expected: testCase.output
            });
        }
        
        res.json({ results });

    } catch (err) {
        console.error("Run Code Controller Error:", err.message || err);
        const statusCode = err.status || 500;
        let errorMessage = err.message || "An unexpected error occurred during code execution.";
        res.status(statusCode).json({ error: errorMessage });
    }
};

module.exports = { runCode };