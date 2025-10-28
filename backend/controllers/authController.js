const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendTokens } = require('../utils/token');

const signup = async (req, res, next) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            res.status(400);
            throw new Error('Please provide all required fields');
        }
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400);
            throw new Error('User with that email already exists');
        }
        const user = await User.create({ name, email, password });
        res.status(201).json({
            message: "User registered successfully",
            user: { _id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            sendTokens(res, user);
            await user.save({ validateBeforeSave: false });
        } else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    } catch (error) {
        next(error);
    }
};

const logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;
        if (refreshToken) {
            const user = await User.findOne({ refreshToken });
            if (user) {
                user.refreshToken = null;
                await user.save({ validateBeforeSave: false });
            }
        }
        res.clearCookie('refreshToken');
        res.status(200).json({ message: 'Logged out successfully' });
    } catch(error) {
        next(error);
    }
};

const refreshToken = async (req, res, next) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: 'No refresh token provided' });
    try {
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded.id);
        if (!user || user.refreshToken !== token) return res.status(403).json({ message: 'Invalid refresh token' });
        sendTokens(res, user);
        await user.save({ validateBeforeSave: false });
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
};

module.exports = { signup, login, logout, refreshToken };