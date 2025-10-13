const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserRole, deleteUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { isAdmin, isSuperAdmin } = require('../middleware/roleMiddleware');

router.route('/').get(protect, isAdmin, getAllUsers);

router.route('/:id').delete(protect, isSuperAdmin, deleteUser);

router.route('/:id/role').put(protect, isSuperAdmin, updateUserRole);

module.exports = router;