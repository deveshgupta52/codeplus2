
const axios = require('axios');

const testRunCode = async () => {
    const payload = {
        questionId: '6927666b1caeaab4ed4048b2',
        language_id: 71, // Python
        source_code: `
        nums_map = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in nums_map:
                return [nums_map[complement], i]
            nums_map[num] = i
        return []
`,
        stdin: '[2,7,11,15]\n9'
    };

    try {
        console.log('Sending request to http://localhost:5000/api/code/run...');
        const response = await axios.post('http://localhost:5000/api/code/run', payload, {
            headers: { 'Content-Type': 'application/json' }
        });
        console.log('--- SUCCESS ---');
        console.log('Status:', response.status);
        console.log('Data:', response.data);
    } catch (error) {
        console.error('--- ERROR ---');
        console.error('The full error object is:', error);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error Message:', error.message);
        }
    }
};

testRunCode();

