// This script is used to seed the database with initial questions and categories.
// To run it, use the command: `npm run seed` from the `backend` directory.

require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Question = require('../models/Question');
const Category = require('../models/Category');

const seedCategories = [
    { name: 'Array', slug: 'array' },
    { name: 'String', slug: 'string' },
    { name: 'Math', slug: 'math' },
];

// --- NEW RICH DESCRIPTIONS ---
const seedQuestions = [
    {
        title: 'Two Sum',
        description: `
Given an array of integers <code>nums</code> and an integer <code>target</code>, return the indices of the two numbers such that they add up to <code>target</code>.
<br><br>
You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice. You can return the answer in any order.
<br><br>
<strong>Example 1:</strong>
<br>
<strong>Input:</strong> nums = [2, 7, 11, 15], target = 9
<br>
<strong>Output:</strong> [0, 1]
<br>
<strong>Explanation:</strong> Because nums[0] + nums[1] == 9, we return [0, 1].
<br><br>
<strong>Constraints:</strong>
<ul>
  <li><code>2 &lt;= nums.length &lt;= 10^4</code></li>
  <li><code>-10^9 &lt;= nums[i] &lt;= 10^9</code></li>
  <li><code>-10^9 &lt;= target &lt;= 10^9</code></li>
  <li>Only one valid answer exists.</li>
</ul>
        `,
        category: 'Array',
        difficulty: 'Easy',
        visibleTestCases: [
            { input: 'nums = [2, 7, 11, 15], target = 9', output: '[0, 1]' },
            { input: 'nums = [3, 2, 4], target = 6', output: '[1, 2]' },
            { input: 'nums = [3, 3], target = 6', output: '[0, 1]' },
        ],
        hiddenTestCases: [
            { input: 'nums = [0, 4, 3, 0], target = 0', output: '[0, 3]' },
            { input: 'nums = [-1, -3, 5, 9], target = 4', output: '[0, 2]' },
            { input: 'nums = [-3, 4, 3, 90], target = 0', output: '[0, 2]' },
            { input: 'nums = [100, 200, 300, 400], target = 700', output: '[2, 3]' },
        ],
    },
    {
        title: 'Valid Palindrome',
        description: `
A phrase is a <strong>palindrome</strong> if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.
<br><br>
Given a string <code>s</code>, return <code>true</code> if it is a palindrome, or <code>false</code> otherwise.
<br><br>
<strong>Example 1:</strong>
<br>
<strong>Input:</strong> s = "A man, a plan, a canal: Panama"
<br>
<strong>Output:</strong> true
<br>
<strong>Explanation:</strong> "amanaplanacanalpanama" is a palindrome.
<br><br>
<strong>Constraints:</strong>
<ul>
  <li><code>1 &lt;= s.length &lt;= 2 * 10^5</code></li>
  <li><code>s</code> consists only of printable ASCII characters.</li>
</ul>
        `,
        category: 'String',
        difficulty: 'Easy',
        visibleTestCases: [
            { input: 's = "A man, a plan, a canal: Panama"', output: 'true' },
            { input: 's = "race a car"', output: 'false' },
            { input: 's = " "', output: 'true' },
        ],
        hiddenTestCases: [
            { input: 's = "level"', output: 'true' },
            { input: 's = "Was it a car or a cat I saw?"', output: 'true' },
            { input: 's = "0P"', output: 'false' },
        ],
    },
    {
        title: 'FizzBuzz',
        description: `
Given an integer <code>n</code>, return a string array <code>answer</code> (1-indexed) where:
<br><br>
<ul>
  <li><code>answer[i] == "FizzBuzz"</code> if <code>i</code> is divisible by 3 and 5.</li>
  <li><code>answer[i] == "Fizz"</code> if <code>i</code> is divisible by 3.</li>
  <li><code>answer[i] == "Buzz"</code> if <code>i</code> is divisible by 5.</li>
  <li><code>answer[i] == i</code> (as a string) if none of the above conditions are true.</li>
</ul>
<br>
<strong>Example 1:</strong>
<br>
<strong>Input:</strong> n = 15
<br>
<strong>Output:</strong> ["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"]
        `,
        category: 'Math',
        difficulty: 'Easy',
        visibleTestCases: [
            { input: 'n = 3', output: '["1", "2", "Fizz"]' },
            { input: 'n = 5', output: '["1", "2", "Fizz", "4", "Buzz"]' },
            { input: 'n = 15', output: '["1",...,"FizzBuzz"]' },
        ],
        hiddenTestCases: [
            { input: 'n = 1', output: '["1"]' },
            { input: 'n = 2', output: '["1", "2"]' },
            { input: 'n = 6', output: '["1",...,"Fizz"]' },
        ],
    },
    {
        title: 'Contains Duplicate',
        description: `
Given an integer array <code>nums</code>, return <code>true</code> if any value appears <strong>at least twice</strong> in the array, and return <code>false</code> if every element is distinct.
<br><br>
<strong>Example 1:</strong>
<br>
<strong>Input:</strong> nums = [1, 2, 3, 1]
<br>
<strong>Output:</strong> true
<br><br>
<strong>Example 2:</strong>
<br>
<strong>Input:</strong> nums = [1, 2, 3, 4]
<br>
<strong>Output:</strong> false
        `,
        category: 'Array',
        difficulty: 'Easy',
        visibleTestCases: [
            { input: 'nums = [1, 2, 3, 1]', output: 'true' },
            { input: 'nums = [1, 2, 3, 4]', output: 'false' },
        ],
        hiddenTestCases: [
            { input: 'nums = []', output: 'false' },
            { input: 'nums = [1, 1, 1]', output: 'true' },
            { input: 'nums = [0, 0]', output: 'true' },
        ],
    },
    {
        title: 'Reverse String',
        description: `
Write a function that reverses a string. The input string is given as an array of characters <code>s</code>.
<br><br>
You must do this by <strong>modifying the input array in-place</strong> with <code>O(1)</code> extra memory.
<br><br>
<strong>Example 1:</strong>
<br>
<strong>Input:</strong> s = ["h", "e", "l", "l", "o"]
<br>
<strong>Output:</strong> ["o", "l", "l", "e", "h"]
        `,
        category: 'String',
        difficulty: 'Easy',
        visibleTestCases: [
            { input: 's = ["h", "e", "l", "l", "o"]', output: '["o", "l", "l", "e", "h"]' },
            { input: 's = ["H", "a", "n", "n", "a", "h"]', output: '["h", "a", "n", "n", "a", "H"]' },
        ],
        hiddenTestCases: [
            { input: 's = ["a"]', output: '["a"]' },
            { input: 's = ["a", "b"]', output: '["b", "a"]' },
        ]
    },
];

const seedDatabase = async () => {
    try {
        await connectDB();
        console.log('Database connected for seeding...');
        console.log('Clearing existing questions and categories...');
        await Question.deleteMany({});
        await Category.deleteMany({});
        console.log('Inserting categories...');
        const createdCategories = await Category.insertMany(seedCategories);
        console.log('Categories inserted successfully.');
        const categoryMap = createdCategories.reduce((acc, category) => {
            acc[category.name] = category._id;
            return acc;
        }, {});
        const questionsWithCategoryIds = seedQuestions.map(question => ({
            ...question,
            category: categoryMap[question.category]
        }));
        console.log('Inserting questions...');
        await Question.insertMany(questionsWithCategoryIds);
        console.log('✅ Questions inserted successfully.');
    } catch (error) {
        console.error('❌ Error during database seeding:', error.message);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('Database disconnected.');
    }
};

seedDatabase();