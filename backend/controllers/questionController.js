const Question = require('../models/Question');
const { cloudinary } = require('../utils/cloudinary');

const createQuestion = async (req, res, next) => {
    const { title, description, category, difficulty, visibleTestCases, hiddenTestCases } = req.body;
    let parsedVisibleTestCases, parsedHiddenTestCases;
    try { parsedVisibleTestCases = JSON.parse(visibleTestCases); }
    catch (error) { return next(new Error('Invalid JSON format in "Visible Test Cases" field.')); }
    try { parsedHiddenTestCases = JSON.parse(hiddenTestCases); }
    catch (error) { return next(new Error('Invalid JSON format in "Hidden Test Cases" field.')); }
    try {
        const questionExists = await Question.findOne({ title });
        if (questionExists) {
            res.status(400);
            throw new Error('A question with this title already exists');
        }
        let image = {};
        if (req.file) {
            image = { public_id: req.file.filename, url: req.file.path };
        }
        const question = await Question.create({
            title, description, category, difficulty, image,
            visibleTestCases: parsedVisibleTestCases,
            hiddenTestCases: parsedHiddenTestCases,
        });
        res.status(201).json(question);
    } catch (error) {
        next(error);
    }
};

const getQuestions = async (req, res, next) => {

    try {
        const questions = await Question.find({}).populate('category', 'name slug');
        res.json(questions);
    } catch (error) {
        next(error);
    }
};

const getQuestionById = async (req, res, next) => {

    try {
        const question = await Question.findById(req.params.id).populate('category', 'name slug');
        if (question) {
            res.json(question);
        } else {
            res.status(404);
            throw new Error('Question not found');
        }
    } catch (error) {
        next(error);
    }
};

const updateQuestion = async (req, res, next) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) {
            res.status(404);
            throw new Error('Question not found');
        }

        const { title, description, category, difficulty, visibleTestCases, hiddenTestCases } = req.body;
        
        question.title = title || question.title;
        question.description = description || question.description;
        question.category = category || question.category;
        question.difficulty = difficulty || question.difficulty;
        
        if (visibleTestCases) question.visibleTestCases = JSON.parse(visibleTestCases);
        if (hiddenTestCases) question.hiddenTestCases = JSON.parse(hiddenTestCases);
        if (req.file) {
            if (question.image && question.image.public_id) {
                await cloudinary.uploader.destroy(question.image.public_id);
            }
            question.image = {
                public_id: req.file.filename,
                url: req.file.path,
            };
        }

        const updatedQuestion = await question.save();
        res.json(updatedQuestion);
    } catch (error) {
        if (error instanceof SyntaxError) {
            res.status(400);
            error.message = 'Invalid JSON format in one of the test case fields.';
        }
        next(error);
    }
};

const deleteQuestion = async (req, res, next) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) {
            res.status(404);
            throw new Error('Question not found');
        }
        if (question.image && question.image.public_id) {
            await cloudinary.uploader.destroy(question.image.public_id);
        }

        await question.deleteOne();
        res.json({ message: 'Question removed successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = { createQuestion, getQuestions, getQuestionById, updateQuestion, deleteQuestion };