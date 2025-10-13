const express = require('express');
const router = express.Router();
const { createCategory, getCategories, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');

router.route('/')
    .post(protect, isAdmin, createCategory)
    .get(getCategories);

router.route('/:id')
    .put(protect, isAdmin, updateCategory)
    .delete(protect, isAdmin, deleteCategory);

module.exports = router;