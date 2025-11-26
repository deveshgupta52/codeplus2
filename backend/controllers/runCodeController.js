const axios = require('axios');
const Question = require('../models/Question');

const languageMap = {
    54: 'cpp', 71: 'python', 62: 'java', 63: 'javascript'
};

const getFullCode = (driver, placeholder, source_code, langKey) => {
    const placeholderLineIndex = driver.split('\n').findIndex(line => line.includes(placeholder));
    if (placeholderLineIndex === -1) {
        throw new Error('Server configuration error: Driver code is invalid.');
    }

    if (langKey === 'python') {
        const driverLines = driver.split('\n');
        const placeholderLine = driverLines[placeholderLineIndex];
        const placeholderIndentMatch = placeholderLine.match(/^(\s*)/);
        const placeholderIndent = placeholderIndentMatch ? placeholderIndentMatch[0] : '';
        const userLines = source_code.split('\n');
        const indentedUserCode = userLines.map(line => (line.trim() === '' ? '' : placeholderIndent + line)).join('\n');
        
        let fullCode = driverLines.slice(0, placeholderLineIndex).join('\n') + '\n' +
                       indentedUserCode + '\n' +
                       driverLines.slice(placeholderLineIndex + 1).join('\n');
        
        fullCode = fullCode.replace(new RegExp('^' + placeholderIndent + 'pass *$', 'gm'), '');
        return fullCode;
    } else {
        return driver.replace(placeholder, source_code);
    }
};

const runCode = async (req, res, next) => {
    const { source_code, language_id, stdin, questionId } = req.body;

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
             console.error("Judge0 RapidAPI Key not found in environment variables.");
             res.status(500); return next(new Error('Server configuration error: API key missing.'));
        }

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

        res.json({
            status: result.status,
            stdout: stdout ? stdout.trim() : null,
            stderr: stderr ? stderr.trim() : null,
            compile_output: compile_output ? compile_output.trim() : null,
            message: message ? message.trim() : null,
            time: result.time,
            memory: result.memory,
        });

    } catch (err) {
         console.error("Judge0 API Error:", err.response?.data || err.message || err);
         const statusCode = err.response?.status || 500;
         let errorMessage = "Code execution failed.";
         if (err.code === 'ECONNABORTED') { errorMessage = "Code execution timed out."; statusCode = 408; }
         else if (err.response?.data) {
              if (err.response.data.stderr) {
                  const decodedErr = Buffer.from(err.response.data.stderr, 'base64').toString('utf-8');
                  if (decodedErr.includes("IndentationError")) {
                      errorMessage = "Indentation Error detected. Please check your Python code's indentation.";
                      statusCode = 400;
                  } else {
                      errorMessage = decodedErr;
                  }
              } else {
                 errorMessage = err.response.data.error || err.response.data.message || "External execution server error.";
              }
         } else if (err.message) { errorMessage = err.message; }
        res.status(statusCode).json({ error: errorMessage });
    }
};

module.exports = { runCode };