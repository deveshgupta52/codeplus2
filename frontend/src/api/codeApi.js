import api from './api';

/**
 * Sends code to the backend for a single run against custom stdin.
 * @param {string} source_code - The user's code.
 * @param {number} language_id - The Judge0 language ID.
 * @param {string} questionId - The ID of the current question (for driver code).
 * @param {string} [stdin=''] - Optional standard input.
 * @returns {Promise<object>} - The single execution result.
 */
export const runCode = (source_code, language_id, questionId) => {
    // Calls POST /api/code/run
    return api.post('/api/code/run', { source_code, language_id, questionId });
};

/**
 * Sends code to the backend for full evaluation against all test cases.
 * @param {string} source_code - The user's code.
 * @param {number} language_id - The Judge0 language ID.
 * @param {string} questionId - The ID of the current question.
 * @returns {Promise<object>} - The final verdict and test case results.
 */
export const submitCode = (source_code, language_id, questionId) => {
    // Calls POST /api/code/submit
    return api.post('/api/code/submit', { source_code, language_id, questionId });
};