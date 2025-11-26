// This script is used to change a user's password.
// To run it, use the command: `node scripts/changePassword.js` from the `backend` directory.

require('dotenv').config();
const readline = require('readline');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (query) => {
    return new Promise((resolve) => {
        rl.question(query, resolve);
    });
};

const changePassword = async () => {
    try {
        await connectDB();
        console.log('Database connected...');

        const email = await askQuestion('Enter the user email: ');
        const newPassword = await askQuestion('Enter the new password: ');

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            console.log('User not found.');
            return;
        }

        user.password = newPassword;
        await user.save();

        console.log('Password changed successfully for user:', email);
    } catch (error) {
        console.error('Error changing password:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('Database disconnected.');
        rl.close();
    }
};

changePassword();
