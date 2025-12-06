// This script is for testing the run/submit code functionality
// It logs in a user, fetches questions, and then attempts to submit a dummy "Accepted" solution
// for each question in each supported language.

require('dotenv').config({ path: __dirname + '/../.env' });
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

const userCredentials = {
    email: 'armaansiddiqui.pms@gmail.com',
    password: '12345'
};

const LANGUAGES = [
    { id: 71, name: 'Python', key: 'python' },
    { id: 63, name: 'JavaScript', key: 'javascript' },
    { id: 54, name: 'C++', key: 'cpp' },
    { id: 62, name: 'Java', key: 'java' },
];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runTests() {
    let token = null;
    let questions = [];

    // 1. Login user
    try {
        console.log('Attempting to log in user...');
        const loginRes = await axios.post(`${BASE_URL}/auth/login`, userCredentials);
        token = loginRes.data.accessToken;
        console.log('Login successful. Token obtained.');
    } catch (error) {
        console.error('Login failed:', error.response?.data || error.message);
        return;
    }

    const authAxios = axios.create({
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    // 2. Fetch all questions
    try {
        console.log('Fetching all questions...');
        const questionsRes = await authAxios.get(`${BASE_URL}/questions`);
        questions = questionsRes.data;
        console.log(`Fetched ${questions.length} questions.`);
    } catch (error) {
        console.error('Fetching questions failed:', error.response?.data || error.message);
        return;
    }

    if (questions.length === 0) {
        console.log('No questions found to test. Ensure seed script has been run.');
        return;
    }

    // 3. Test each question with a dummy solution for each language
    for (const question of questions) {
        console.log(`\n--- Testing Question: ${question.title} (ID: ${question._id}) ---`);

        for (const lang of LANGUAGES) {
            console.log(`  Testing language: ${lang.name}`);

            const source_code_template = question.starterCode?.[lang.key];
            if (!source_code_template) {
                console.warn(`    No starter code found for ${lang.name}. Skipping.`);
                continue;
            }

            // Replace USER_CODE_HERE with a simple return statement to make it compile/run
            // This is a minimal valid solution for each problem type
            let dummy_source_code = source_code_template;
            if (lang.key === 'python') {
                if (question.title === 'Two Sum') {
                    dummy_source_code = source_code_template.replace('# USER_CODE_HERE', `        hashmap = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in hashmap:
                return [hashmap[complement], i]
            hashmap[num] = i
        return []`);
                } else if (question.title === 'Valid Palindrome') {
                    dummy_source_code = source_code_template.replace('# USER_CODE_HERE', `        new_s = "".join(filter(str.isalnum, s)).lower()
        return new_s == new_s[::-1]`);
                } else if (question.title === 'FizzBuzz') {
                    dummy_source_code = source_code_template.replace('# USER_CODE_HERE', `        res = []
        for i in range(1, n + 1):
            if i % 15 == 0: res.append("FizzBuzz")
            elif i % 3 == 0: res.append("Fizz")
            elif i % 5 == 0: res.append("Buzz")
            else: res.append(str(i))
        return res`);
                } else if (question.title === 'Contains Duplicate') {
                    dummy_source_code = source_code_template.replace('# USER_CODE_HERE', `        return len(set(nums)) != len(nums)`);
                } else if (question.title === 'Reverse String') {
                    dummy_source_code = source_code_template.replace('# USER_CODE_HERE', `        s.reverse()`);
                } else if (question.title === 'Valid Anagram') {
                    dummy_source_code = source_code_template.replace('# USER_CODE_HERE', `        return sorted(s) == sorted(t)`);
                }
            } else if (lang.key === 'javascript') {
                if (question.title === 'Two Sum') {
                    dummy_source_code = source_code_template.replace('// USER_CODE_HERE', `    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];`);
                } else if (question.title === 'Valid Palindrome') {
                    dummy_source_code = source_code_template.replace('// USER_CODE_HERE', `    const cleanedS = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    return cleanedS === cleanedS.split('').reverse().join('');`);
                } else if (question.title === 'FizzBuzz') {
                    dummy_source_code = source_code_template.replace('// USER_CODE_HERE', `    const result = [];
    for (let i = 1; i <= n; i++) {
        if (i % 15 === 0) result.push("FizzBuzz");
        else if (i % 3 === 0) result.push("Fizz");
        else if (i % 5 === 0) result.push("Buzz");
        else result.push(String(i));
    }
    return result;`);
                } else if (question.title === 'Contains Duplicate') {
                    dummy_source_code = source_code_template.replace('// USER_CODE_HERE', `    const seen = new Set();
    for (const num of nums) {
        if (seen.has(num)) { return true; }
        seen.add(num);
    }
    return false;`);
                } else if (question.title === 'Reverse String') {
                    dummy_source_code = source_code_template.replace('// USER_CODE_HERE', `    let left = 0;
    let right = s.length - 1;
    while (left < right) {
        [s[left], s[right]] = [s[right], s[left]];
        left++;
        right--;
    }`);
                } else if (question.title === 'Valid Anagram') {
                    dummy_source_code = source_code_template.replace('// USER_CODE_HERE', `    if (s.length !== t.length) return false;
    const charCount = {};
    for (const char of s) {
        charCount[char] = (charCount[char] || 0) + 1;
    }
    for (const char of t) {
        if (!charCount[char]) return false;
        charCount[char]--;
    }
    return true;`);
                }
            } else if (lang.key === 'cpp') {
                if (question.title === 'Two Sum') {
                    dummy_source_code = source_code_template.replace('// USER_CODE_HERE', `        unordered_map<int, int> hashmap;
        for (int i = 0; i < nums.size(); ++i) {
            int complement = target - nums[i];
            if (hashmap.count(complement)) {
                return {hashmap[complement], i};
            }
            hashmap[nums[i]] = i;
        }
        return {};`);
                } else if (question.title === 'Valid Palindrome') {
                    dummy_source_code = source_code_template.replace('// USER_CODE_HERE', `        string cleanedS;
        for (char c : s) {
            if (isalnum(c)) {
                cleanedS += tolower(c);
            }
        }
        string reversedS = cleanedS;
        reverse(reversedS.begin(), reversedS.end());
        return cleanedS == reversedS;`);
                } else if (question.title === 'FizzBuzz') {
                    dummy_source_code = source_code_template.replace('// USER_CODE_HERE', `        vector<string> result;
        for (int i = 1; i <= n; ++i) {
            if (i % 15 == 0) result.push_back("FizzBuzz");
            else if (i % 3 == 0) result.push_back("Fizz");
            else if (i % 5 == 0) result.push_back("Buzz");
            else result.push_back(to_string(i));
        }
        return result;`);
                } else if (question.title === 'Contains Duplicate') {
                    dummy_source_code = source_code_template.replace('// USER_CODE_HERE', `        unordered_set<int> seen;
        for (int num : nums) {
            if (seen.count(num)) { return true; }
            seen.insert(num);
        }
        return false;`);
                } else if (question.title === 'Reverse String') {
                    dummy_source_code = source_code_template.replace('// USER_CODE_HERE', `        int left = 0;
        int right = s.size() - 1;
        while (left < right) {
            swap(s[left], s[right]);
            left++;
            right--;
        }`);
                } else if (question.title === 'Valid Anagram') {
                    dummy_source_code = source_code_template.replace('// USER_CODE_HERE', `        if (s.length() != t.length()) return false;
        unordered_map<char, int> charCount;
        for (char c : s) {
            charCount[c]++;
        }
        for (char c : t) {
            if (charCount.count(c) == 0 || charCount[c] == 0) return false;
            charCount[c]--;
        }
        return true;`);
                }
            } else if (lang.key === 'java') {
                if (question.title === 'Two Sum') {
                    dummy_source_code = source_code_template.replace('// USER_CODE_HERE', `        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[]{map.get(complement), i};
            }
            map.put(nums[i], i);
        }
        return new int[]{};`);
                } else if (question.title === 'Valid Palindrome') {
                    dummy_source_code = source_code_template.replace('// USER_CODE_HERE', `        StringBuilder cleanedS = new StringBuilder();
        for (char c : s.toCharArray()) {
            if (Character.isLetterOrDigit(c)) {
                cleanedS.append(Character.toLowerCase(c));
            }
        }
        String original = cleanedS.toString();
        String reversed = cleanedS.reverse().toString();
        return original.equals(reversed);`);
                } else if (question.title === 'FizzBuzz') {
                    dummy_source_code = source_code_template.replace('// USER_CODE_HERE', `        List<String> result = new ArrayList<>();
        for (int i = 1; i <= n; i++) {
            if (i % 15 == 0) result.add("FizzBuzz");
            else if (i % 3 == 0) result.add("Fizz");
            else if (i % 5 == 0) result.add("Buzz");
            else result.add(String.valueOf(i));
        }
        return result;`);
                } else if (question.title === 'Contains Duplicate') {
                    dummy_source_code = source_code_template.replace('// USER_CODE_HERE', `        Set<Integer> seen = new HashSet<>();
        for (int num : nums) {
            if (seen.contains(num)) { return true; }
            seen.add(num);
        }
        return false;`);
                } else if (question.title === 'Reverse String') {
                    dummy_source_code = source_code_template.replace('// USER_CODE_HERE', `        int left = 0;
        int right = s.length - 1;
        while (left < right) {
            char temp = s[left];
            s[left] = s[right];
            s[right] = temp;
            left++;
            right--;
        }`);
                } else if (question.title === 'Valid Anagram') {
                    dummy_source_code = source_code_template.replace('// USER_CODE_HERE', `        if (s.length() != t.length()) return false;
        Map<Character, Integer> charCount = new HashMap<>();
        for (char c : s.toCharArray()) {
            charCount.put(c, charCount.getOrDefault(c, 0) + 1);
        }
        for (char c : t.toCharArray()) {
            if (!charCount.containsKey(c) || charCount.get(c) == 0) return false;
            charCount.put(c, charCount.get(c) - 1);
        }
        return true;`);
                }
            }


            // Run Code
            console.log(`    Running code for ${lang.name}...`);
            let runPassed = true;
            try {
                const stdin = question.visibleTestCases[0]?.input || ''; // Use first visible test case as stdin
                const runRes = await authAxios.post(`${BASE_URL}/code/run`, {
                    source_code: dummy_source_code,
                    language_id: lang.id,
                    questionId: question._id,
                    stdin: stdin
                });
                if (runRes.data.status?.id === 3) {
                    console.log(`      Run success (Status: ${runRes.data.status.description})`);
                } else {
                    console.error(`      Run failed (Status: ${runRes.data.status?.description || 'Unknown'})`);
                    console.error(`      Stderr: ${runRes.data.stderr || 'N/A'}`);
                    runPassed = false;
                }
            } catch (error) {
                console.error(`      Run API call failed for ${lang.name}:`, error.response?.data || error.message);
                runPassed = false;
            }
            await sleep(1000); // Wait to avoid rate limiting

            // Submit Code (only if run passed, to simplify debugging)
            if (runPassed) {
                console.log(`    Submitting code for ${lang.name}...`);
                try {
                    const submitRes = await authAxios.post(`${BASE_URL}/code/submit`, {
                        source_code: dummy_source_code,
                        language_id: lang.id,
                        questionId: question._id
                    });
                    if (submitRes.data.finalVerdict === "Accepted") {
                        console.log(`      Submit success (Verdict: ${submitRes.data.finalVerdict})`);
                    } else {
                        console.error(`      Submit failed (Verdict: ${submitRes.data.finalVerdict})`);
                        if (submitRes.data.failedCase) {
                            console.error(`        Failed Case Input: ${submitRes.data.failedCase.input}`);
                            console.error(`        Failed Case Expected: ${submitRes.data.failedCase.expected}`);
                            console.error(`        Failed Case Received: ${submitRes.data.failedCase.received}`);
                            console.error(`        Failed Case Stderr: ${submitRes.data.failedCase.result?.stderr || 'N/A'}`);
                        }
                    }
                } catch (error) {
                    console.error(`      Submit API call failed for ${lang.name}:`, error.response?.data || error.message);
                }
            }
            await sleep(1000); // Wait to avoid rate limiting
        }
    }
}

runTests();
