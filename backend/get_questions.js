const axios = require('axios');

const getQuestions = async () => {
    try {
        // Login to get token
        console.log('Logging in...');
        const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'armaansiddiqui.pms@gmail.com',
            password: '12345'
        });
        const token = loginResponse.data.accessToken;
        console.log('Login successful');

        // Get questions
        console.log('Fetching questions...');
        const response = await axios.get('http://localhost:5000/api/questions', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('Questions:');
        response.data.forEach(q => {
            console.log(`${q._id}: ${q.title}`);
        });
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
};

getQuestions();
