const Category = require('../models/Category');
const Question = require('../models/Question');

const createCategory = async (req, res, next) => {
    const { name } = req.body;
    if (!name) {
        res.status(400);
        return next(new Error('Category name is required'));
    }
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    try {
        const categoryExists = await Category.findOne({ slug });
        if (categoryExists) {
            res.status(400);
            throw new Error('Category already exists');
        }
        const category = await Category.create({ name, slug });
        res.status(201).json(category);
    } catch (error) {
        next(error);
    }
};

const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find({}).sort({ name: 1 });
        res.json(categories);
    } catch (error) {
        next(error);
    }
};

// --- NEW FUNCTION ---
const updateCategory = async (req, res, next) => {
    const { name } = req.body;
    if (!name) {
        res.status(400);
        return next(new Error('Category name is required'));
    }
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            res.status(404);
            throw new Error('Category not found');
        }
        category.name = name;
        category.slug = name.toLowerCase().replace(/\s+/g, '-');
        const updatedCategory = await category.save();
        res.json(updatedCategory);
    } catch (error) {
        next(error);
    }
};

const deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            res.status(404);
            throw new Error('Category not found');
        }

        const questionCount = await Question.countDocuments({ category: category._id });
        if (questionCount > 0) {
            res.status(400);
            throw new Error('Cannot delete category. It is currently in use by one or more questions.');
        }

        await category.deleteOne();
        res.json({ message: 'Category removed successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = { createCategory, getCategories, updateCategory, deleteCategory };