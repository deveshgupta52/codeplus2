const User = require('../models/User');

// @desc    Get all users (for admins)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({}).select('-password -refreshToken');
        res.json(users);
    } catch (error) {
        next(error);
    }
};

// @desc    Update a user's role (for superadmins)
// @route   PUT /api/users/:id/role
// @access  Private/SuperAdmin
const updateUserRole = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            if (req.user.id === user.id) {
                res.status(403);
                throw new Error("You cannot change your own role.");
            }
            if (user.role === 'superadmin') {
                res.status(403);
                throw new Error("Cannot change a Super Admin's role.");
            }

            user.role = req.body.role || user.role;
            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a user (for superadmins)
// @route   DELETE /api/users/:id
// @access  Private/SuperAdmin
const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            if (user.role === 'superadmin') {
                res.status(400);
                throw new Error('Cannot delete a Super Admin account.');
            }
            await user.deleteOne();
            res.json({ message: 'User removed successfully' });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllUsers, updateUserRole, deleteUser };