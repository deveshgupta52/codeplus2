const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
    input: { type: String, required: true },
    output: { type: String, required: true },
}, { _id: false });

const questionSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    image: { public_id: { type: String }, url: { type: String } },
    visibleTestCases: [testCaseSchema],
    hiddenTestCases: [testCaseSchema],
}, { timestamps: true });

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;