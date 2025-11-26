const axios = require('axios');
const Question = require('../models/Question');
const User = require('../models/User');

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
        const indentedUserCode = userLines.map(line => (line.trim() === '' ? '' : placeholderIndent + line)).join('\n');
        
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

const runSingleTestCase = async (apiKey, fullCode, language_id, stdin, expected_output) => {
    try {
        const response = await axios.post(
            "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=true",
            {
                source_code: Buffer.from(fullCode).toString('base64'),
                language_id: language_id,
                stdin: Buffer.from(stdin || "").toString('base64'),
                expected_output: Buffer.from(expected_output || "").toString('base64'),
            },
            {
                headers: {
                    "content-type": "application/json",
                    "X-RapidAPI-Key": apiKey,
                    "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
                },
                timeout: 10000 // 10 second timeout per case
            }
        );
        
        const result = response.data;

        // Decode the outputs
        const stdout = result.stdout ? Buffer.from(result.stdout, 'base64').toString('utf-8').trim() : null;
        const stderr = result.stderr ? Buffer.from(result.stderr, 'base64').toString('utf-8').trim() : null;
        const compile_output = result.compile_output ? Buffer.from(result.compile_output, 'base64').toString('utf-8').trim() : null;

        return {
            ...result,
            stdout,
            stderr,
            compile_output,
            message: result.message ? Buffer.from(result.message, 'base64').toString('utf-8') : null,
        };
    } catch (err) {
        console.error("Error in runSingleTestCase:", err.response?.data || err.message);

        let statusDescription = "Internal Judge Error";
        let detailedError = "Failed to execute test case.";

        if (err.code === 'ECONNABORTED') {
            statusDescription = "Time Limit Exceeded";
            detailedError = "The code execution timed out.";
        } else if (err.response?.data) {
            const { message, stderr, compile_output, error } = err.response.data;
            if (error) { // This is often the case for auth errors
                statusDescription = "API Error";
                detailedError = error;
            } else if (compile_output) {
                statusDescription = "Compilation Error";
                detailedError = Buffer.from(compile_output, 'base64').toString('utf-8');
            } else if (stderr) {
                statusDescription = "Runtime Error";
                detailedError = Buffer.from(stderr, 'base64').toString('utf-8');
            } else if (message) {
                statusDescription = "Execution Error";
                detailedError = Buffer.from(message, 'base64').toString('utf-8');
            }
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

const submitCode = async (req, res, next) => {
    const { source_code, language_id, questionId } = req.body;
    const userId = req.user.id; 
    if (!source_code || language_id === undefined || !questionId) {
        res.status(400);
        return next(new Error('Missing source_code, language_id, or questionId.'));
    }

    try {
        const question = await Question.findById(questionId);
        if (!question || !question.driverCode) {
            res.status(404); return next(new Error('Question or driver code not found.'));
        }

        const langKey = languageMap[language_id];
        if (!langKey) {
            res.status(400); return next(new Error('Unsupported language ID.'));
        }

        const driver = question.driverCode[langKey];
        if (!driver) {
             res.status(404); return next(new Error(`Driver code for language "${langKey}" not found.`));
        }
        
        const userCodePlaceholder = { cpp: '// USER_CODE_HERE', python: '# USER_CODE_HERE', java: '// USER_CODE_HERE', javascript: '// USER_CODE_HERE' }[langKey];
        const fullCode = getFullCode(driver, userCodePlaceholder, source_code, langKey);

        const apiKey = process.env.JUDGE0_RAPIDAPI_KEY;
        if (!apiKey) {
             console.error("Judge0 Key missing.");
             res.status(500); return next(new Error('Server configuration error: API key missing.'));
        }
        
        const allTestCases = [...question.visibleTestCases, ...question.hiddenTestCases];
        let finalVerdict = "Accepted";
        let failedCase = null;
        let allResults = [];

        for (let i = 0; i < allTestCases.length; i++) {
            const testCase = allTestCases[i];
            const result = await runSingleTestCase(
                apiKey, 
                fullCode, 
                language_id, 
                testCase.input, 
                testCase.output
            );
            allResults.push(result);

            // Check for failure
            // Judge0 status IDs: 3 = Accepted, 4 = Wrong Answer, 5 = Time Limit, 6 = Compilation Error
            if (result.status.id !== 3) { 
                finalVerdict = result.status.description || "Error";
                if (result.status.id === 6) finalVerdict = "Compilation Error";
                if (result.status.id === 5) finalVerdict = "Time Limit Exceeded";
                if (result.status.id === 4) finalVerdict = "Wrong Answer";

                failedCase = {
                    case: i + 1,
                    result: result,
                    input: testCase.input,
                    expected: testCase.output,
                    received: result.stdout
                };
                break;
            }
        }
        
        if (finalVerdict === "Accepted") {
            await User.findByIdAndUpdate(userId, {
                $addToSet: { solvedQuestions: question._id }, 
                $inc: { totalSubmissions: 1 } 
            });
        }
        
        res.json({
            finalVerdict: finalVerdict,
            failedCase: failedCase,
            allResults: allResults 
        });

    } catch (err) {
         console.error("Submission Controller Error:", err.message || err);
         const statusCode = err.status || 500;
         let errorMessage = err.message || "Code submission failed.";
         res.status(statusCode).json({ error: errorMessage });
    }
};

module.exports = { submitCode };