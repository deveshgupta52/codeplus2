require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const User = require('./models/User');

const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const questionRoutes = require('./routes/questionRoutes');
const userRoutes = require('./routes/userRoutes');

const codeRoutes = require('./routes/codeRoutes');

connectDB();

// const createSuperAdminOnStartup = async () => {
//     try {
//         const adminEmail = process.env.SUPER_ADMIN_EMAIL;
//         const adminPassword = process.env.SUPER_ADMIN_PASSWORD;
//         if (!adminEmail || !adminPassword) { 
//             return; 
//         }
//         const adminExists = await User.findOne({ email: adminEmail });
//         if (!adminExists) {
//             await User.create({
//                 name: 'Super Admin', email: adminEmail, password: adminPassword, role: 'superadmin'
//             });
//             console.log('Super Admin account created successfully!');
//         }
//     } catch (error) {
//         console.error('Error during Super Admin creation:', error.message);
//     }
// };
// mongoose.connection.once('open', () => {
//     createSuperAdminOnStartup();
// });

const app = express();

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'https://code-t3sb.vercel.app'
];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error(`The CORS policy for this site does not allow access from the specified Origin: ${origin}`));
        }
    },
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/api', (req, res) => res.send('Code++ API is running...'));
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/code', codeRoutes);
app.use('/api', require('./routes/discussionRoutes'));

const frontendBuildPath = path.resolve(__dirname, '..', 'frontend', 'dist'); 
if (process.env.NODE_ENV === 'production' || fs.existsSync(frontendBuildPath)) {
    console.log(`Serving static files from: ${frontendBuildPath}`);
    app.use(express.static(frontendBuildPath));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(frontendBuildPath, 'index.html'));
    });
} else {
    console.log('Static file serving skipped (NODE_ENV is not "production" or build directory not found).');
}
app.use(notFound);
app.use(errorHandler);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));