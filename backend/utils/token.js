const jwt = require('jsonwebtoken');

const sendTokens = (res, user) => {
    const accessToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '24h' } 
    );

    const refreshToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '30d' }
    );
    user.refreshToken = refreshToken;
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // MODIFIED: 30 days
    });

    res.json({ accessToken });
};

module.exports = { sendTokens };