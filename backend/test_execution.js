const axios = require('axios');

const loginAndTest = async () => {
    try {
        // Login to get token
        console.log('Logging in...');
        const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'armaansiddiqui.pms@gmail.com',
            password: '12345'
        });
        const token = loginResponse.data.accessToken;
        console.log('Login successful, token:', token);

        // Now test run code
        const payload = {
            questionId: '6927666b1caeaab4ed4048b2', // Assuming this is the Two Sum question ID
            language_id: 71, // Python
            source_code: `        nums_map = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in nums_map:
                return [nums_map[complement], i]
            nums_map[num] = i
        return []`,
            stdin: '[2,7,11,15]\n9'
        };

        console.log('Sending run code request...');
        const response = await axios.post('http://localhost:5000/api/code/run', payload, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('--- SUCCESS ---');
        console.log('Status:', response.status);
        console.log('Data:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('--- ERROR ---');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error Message:', error.message);
        }
    }
};

loginAndTest();
