// This script is used to seed the database with initial questions and categories.
// To run it, use the command: `npm run seed` from the `backend` directory.

require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Question = require('../models/Question');
const Category = require('../models/Category');

const seedCategories = [
    { name: 'Array', slug: 'array' },
    { name: 'String', slug: 'string' },
    { name: 'Math', slug: 'math' },
];

const seedQuestions = [
    { // --- Two Sum ---
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
</ul>`,
        category: 'Array',
        difficulty: 'Easy',
        starterCode: {
            python: `class Solution:\n    def twoSum(self, nums, target):\n        # USER_CODE_HERE\n        pass\n`,
            javascript: `/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    // USER_CODE_HERE\n};\n`,
            cpp: `#include <vector>\n#include <unordered_map>\n\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // USER_CODE_HERE\n        return {};\n    }\n};`,
            java: `import java.util.HashMap;\nimport java.util.Map;\n\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // USER_CODE_HERE\n        return new int[]{};\n    }\n}`
        },
        driverCode: {
            python: `import sys\nimport json\nfrom typing import List\n\nclass Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        # USER_CODE_HERE\n        pass\n\nif __name__ == '__main__':\n    lines = sys.stdin.read().splitlines()\n    nums = json.loads(lines[0])\n    target = int(lines[1])\n    sol = Solution()\n    result = sol.twoSum(nums, target)\n    if isinstance(result, list):\n        print(json.dumps(sorted(result)).replace(" ", "")) \n    else:\n        print("[]")\n`,
            javascript: `var twoSum = function(nums, target) {\n    // USER_CODE_HERE\n};\n\nprocess.stdin.resume();\nprocess.stdin.setEncoding('utf-8');\nlet inputString = '';\nprocess.stdin.on('data', inputStdin => { inputString += inputStdin; });\nprocess.stdin.on('end', _ => {\n    inputString = inputString.trim().split('\\n').map(str => str.trim());\n    const nums = JSON.parse(inputString[0]);\n    const target = parseInt(inputString[1]);\n    main(nums, target);\n});\n\nfunction main(nums, target) {\n    let result;\n    try {\n      if (typeof twoSum !== 'function') throw new Error('twoSum function not defined');\n      result = twoSum(nums, target);\n      if (!Array.isArray(result)) { result = []; }\n    } catch (e) {\n      result = []; \n      console.error("Runtime Error:", e.message);\n    }\n    console.log(JSON.stringify(result.sort((a,b) => a - b)).replace(/,/g, ','));\n}\n`,
            cpp: `#include <iostream>\n#include <vector>\n#include <string>\n#include <sstream>\n#include <algorithm>\n#include <unordered_map>\n#include <stdexcept>\n\nusing namespace std;\n\nvector<int> parseVector(const string& str) {\n    vector<int> result;\n    if (str.length() <= 2) return result; \n    stringstream ss(str.substr(1, str.length() - 2));\n    string num_str;\n    while (getline(ss, num_str, ',')) { \n        num_str.erase(0, num_str.find_first_not_of(" \t")); \n        num_str.erase(num_str.find_last_not_of(" \t") + 1);\n        if (!num_str.empty()) try { result.push_back(stoi(num_str)); } catch (...) { cerr << "Error parsing number: " << num_str << endl; }\n    }\n    return result;\n}\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // USER_CODE_HERE\n    }\n};\n\nint main() {\n    string line1, line2;\n    vector<int> nums;\n    int target = 0;\n    try {\n      getline(cin, line1);\n      getline(cin, line2);\n      nums = parseVector(line1);\n      target = stoi(line2);\n      Solution sol;\n      vector<int> result = sol.twoSum(nums, target);\n      sort(result.begin(), result.end());\n      cout << "[";\n      for (size_t i = 0; i < result.size(); ++i) { cout << result[i] << (i == result.size() - 1 ? "" : ","); }\n      cout << "]" << endl;\n    } catch (const exception& e) {\n        cerr << "Exception caught in main: " << e.what() << endl;\n        cout << "[]" << endl; \n    }\n    return 0;\n}`,
            java: `import java.util.*;\nimport java.io.*;\n\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // USER_CODE_HERE\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n      int[] nums = {};\n      int target = 0;\n      try {\n        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));\n        String line1 = reader.readLine();\n        String line2 = reader.readLine();\n        reader.close();\n        String numsStr = line1.trim();\n        String targetStr = line2.trim();\n        String numsContent = numsStr.substring(1, numsStr.length() - 1);\n        if (!numsContent.isEmpty()){\n            String[] numsArrStr = numsContent.split(",");\n            nums = new int[numsArrStr.length];\n            for (int i = 0; i < numsArrStr.length; i++) { \n                String numTrimmed = numsArrStr[i].trim();\n                if (!numTrimmed.isEmpty()) { nums[i] = Integer.parseInt(numTrimmed); }\n            }\n        } else {\n            nums = new int[0];\n        }\n        target = Integer.parseInt(targetStr);\n        Solution sol = new Solution();\n        int[] result = sol.twoSum(nums, target);\n        Arrays.sort(result);\n        System.out.println(Arrays.toString(result).replaceAll(" ", ""));\n      } catch (Exception e) {\n          System.err.println("Exception caught in main: " + e.getMessage());\n          System.out.println("[]"); \n      }\n    }\n}`
        },
        visibleTestCases: [
            { input: '[2,7,11,15]\n9', output: '[0,1]' },
            { input: '[3,2,4]\n6', output: '[1,2]' },
            { input: '[3,3]\n6', output: '[0,1]' },
        ],
        hiddenTestCases: [
            { input: '[0,4,3,0]\n0', output: '[0,3]' },
            { input: '[-1,-3,5,9]\n4', output: '[0,2]' },
            { input: '[-3,4,3,90]\n0', output: '[0,2]' },
            { input: '[100,200,300,400]\n700', output: '[2,3]' },
            { input: '[5,2,11,7]\n9', output: '[1,3]' },
            { input: '[20,1,5,11]\n21', output: '[0,1]' },
            { input: '[1,2,3,4,5]\n9', output: '[3,4]' },
            { input: '[-10,-1,-18,-19]\n-19', output: '[1,2]' },
            { input: '[1,1,1,1]\n2', output: '[0,1]' },
            { input: '[2,5,5,11]\n10', output: '[1,2]' },
        ],
    },
    { // --- Valid Palindrome ---
        title: 'Valid Palindrome',
        description: `
A phrase is a <strong>palindrome</strong> if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.
<br><br>
Given a string <code>s</code>, return <code>true</code> if it is a palindrome, or <code>false</code> otherwise.
<br><br>
<strong>Example 1:</strong>
<br>
<strong>Input:</strong> "A man, a plan, a canal: Panama"
<br>
<strong>Output:</strong> true
<br>
<strong>Explanation:</strong> "amanaplanacanalpanama" is a palindrome.
<br><br>
<strong>Constraints:</strong>
<ul>
  <li><code>1 &lt;= s.length &lt;= 2 * 10^5</code></li>
  <li><code>s</code> consists only of printable ASCII characters.</li>
</ul>`,
        category: 'String',
        difficulty: 'Easy',
        starterCode: {
            python: `class Solution:\n    def isPalindrome(self, s):\n        # USER_CODE_HERE\n        pass\n`,
            javascript: `/**\n * @param {string} s\n * @return {boolean}\n */\nvar isPalindrome = function(s) {\n    // USER_CODE_HERE\n};\n`,
            cpp: `#include <string>\n#include <algorithm>\n#include <cctype>\n\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isPalindrome(string s) {\n        // USER_CODE_HERE\n        return false;\n    }\n};`,
            java: `class Solution {\n    public boolean isPalindrome(String s) {\n        // USER_CODE_HERE\n        return false;\n    }\n}`
        },
        driverCode: {
             python: `import sys\nimport json\nfrom typing import List\n\nclass Solution:\n    def isPalindrome(self, s: str) -> bool:\n        # USER_CODE_HERE\n        pass\n\nif __name__ == '__main__':\n    line = sys.stdin.readline()\n    s = json.loads(line.strip())\n    sol = Solution()\n    result = sol.isPalindrome(s)\n    print(str(result).lower())\n`,
             javascript: `var isPalindrome = function(s) {\n    // USER_CODE_HERE\n};\n\nprocess.stdin.resume();\nprocess.stdin.setEncoding('utf-8');\nlet inputString = '';\nprocess.stdin.on('data', inputStdin => { inputString += inputStdin; });\nprocess.stdin.on('end', _ => {\n    const s = JSON.parse(inputString.trim());\n    main(s);\n});\n\nfunction main(s) {\n    let result;\n    try {\n      if (typeof isPalindrome !== 'function') throw new Error('isPalindrome function not defined');\n      result = isPalindrome(s);\n    } catch(e) {\n      result = false;\n      console.error("Runtime Error:", e.message);\n    }\n    console.log(result ? 'true' : 'false');\n}\n`,
            cpp: `#include <iostream>\n#include <string>\n#include <algorithm>\n#include <cctype>\n#include <stdexcept>\n\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isPalindrome(string s) {\n        // USER_CODE_HERE\n    }\n};\n\nint main() {\n    string line;\n    string s_str;\n    try {\n      getline(cin, line);\n      if (!line.empty() && line.length() >= 2) {\n          s_str = line.substr(1, line.length() - 2);\n          size_t pos = s_str.find("\\\"");\n          while (pos != std::string::npos) { s_str.replace(pos, 2, "\""); pos = s_str.find("\\\"", pos + 1); }\n          Solution sol;\n          bool result = sol.isPalindrome(s_str);\n          cout << (result ? "true" : "false") << endl;\n      } else if (line == "\" \"") {\n          Solution sol;\n          bool result = sol.isPalindrome(" ");\n          cout << (result ? "true" : "false") << endl;\n      } else { \n          s_str = line;\n          s_str.erase(0, s_str.find_first_not_of(" \t\""));\n          s_str.erase(s_str.find_last_not_of(" \t\"") + 1);\n          Solution sol;\n          bool result = sol.isPalindrome(s_str);\n          cout << (result ? "true" : "false") << endl;\n      }\n    } catch(const exception& e) {\n        cerr << "Exception caught in main: " << e.what() << endl;\n        cout << "false" << endl;\n    }\n    return 0;\n}`,
            java: `import java.util.*;\nimport java.io.*;\n\nclass Solution {\n    public boolean isPalindrome(String s) {\n        // USER_CODE_HERE\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n      String s = "";\n      try {\n        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));\n        String line = reader.readLine();\n        reader.close();\n        String sStr = line.trim();\n        if (sStr.length() >= 2 && sStr.startsWith("\"") && sStr.endsWith("\"")) {\n            s = sStr.substring(1, sStr.length() - 1).replace("\\\\\"", "\""); \n        } else {\n             s = sStr;\n        }\n        Solution sol = new Solution();\n        boolean result = sol.isPalindrome(s);\n        System.out.println(result);\n      } catch (Exception e) {\n          System.err.println("Exception caught in main: " + e.getMessage());\n          System.out.println("false");\n      }\n    }\n}`
        },
        visibleTestCases: [
            { input: '"A man, a plan, a canal: Panama"', output: 'true' },
            { input: '"race a car"', output: 'false' },
            { input: '" "', output: 'true' },
        ],
        hiddenTestCases: [
             { input: '"level"', output: 'true' },
             { input: '"Was it a car or a cat I saw?"', output: 'true' },
             { input: '"0P"', output: 'false' },
             { input: '"12321"', output: 'true' },
             { input: '"a"', output: 'true' },
             { input: '"ab"', output: 'false' },
             { input: '".,"', output: 'true' },
             { input: '"No lemon, no melon."', output: 'true' },
             { input: '"hello"', output: 'false' },
             { input: '"Racecar"', output: 'true' },
        ],
    },
    { // --- FizzBuzz ---
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
<strong>Input:</strong> 15
<br>
<strong>Output:</strong> ["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"]
        `,
        category: 'Math',
        difficulty: 'Easy',
        starterCode: {
             cpp: `#include <vector>\n#include <string>\n\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<string> fizzBuzz(int n) {\n        // USER_CODE_HERE\n        return {};\n    }\n};`,
            python: `from typing import List\n\nclass Solution:\n    def fizzBuzz(self, n: int) -> List[str]:\n        # USER_CODE_HERE\n        pass\n`,
            java: `import java.util.ArrayList;\nimport java.util.List;\n\nclass Solution {\n    public List<String> fizzBuzz(int n) {\n        // USER_CODE_HERE\n        return new ArrayList<>();\n    }\n}`,
            javascript: `/**\n * @param {number} n\n * @return {string[]}\n */\nvar fizzBuzz = function(n) {\n    // USER_CODE_HERE\n};\n`
        },
        driverCode: {
            python: `import sys\nimport json\nfrom typing import List\n\nclass Solution:\n    def fizzBuzz(self, n: int) -> List[str]:\n        # USER_CODE_HERE\n        pass\n\nif __name__ == '__main__':\n    line = sys.stdin.readline()\n    n = int(line.strip())\n    sol = Solution()\n    result = sol.fizzBuzz(n)\n    print(json.dumps(result))\n`,
            javascript: `process.stdin.resume();\nprocess.stdin.setEncoding('utf-8');\nlet inputString = '';\nprocess.stdin.on('data', inputStdin => { inputString += inputStdin; });\nprocess.stdin.on('end', _ => {\n    const n = parseInt(inputString.trim());\n    main(n);\n});\n\n\nfunction main(n) {\n    // USER_CODE_HERE\n    let result;\n    try {\n      if (typeof fizzBuzz !== 'function') throw new Error('fizzBuzz function not defined');\n      result = fizzBuzz(n);\n      if (!Array.isArray(result)) { result = []; }\n    } catch(e) {\n        result = [];\n        console.error("Runtime Error:", e.message);\n    }\n    console.log(JSON.stringify(result));\n}\n`,
            cpp: `#include <iostream>\n#include <vector>\n#include <string>\n#include <stdexcept>\n\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<string> fizzBuzz(int n) {\n        // USER_CODE_HERE\n        return {};\n    }\n};\n\nint main() {\n    string line;\n    int n = 0;\n    try {\n      getline(cin, line);\n      n = stoi(line);\n      Solution sol;\n      vector<string> result = sol.fizzBuzz(n);\n      cout << "[";\n      for (size_t i = 0; i < result.size(); ++i) {\n          string res_str = result[i];\n          size_t pos = res_str.find('\"');\n          while(pos != string::npos){ res_str.replace(pos, 1, "\\\""); pos = res_str.find('\"', pos + 2); }\n          cout << "\\\"" << res_str << "\\\"" << (i == result.size() - 1 ? "" : ",");\n      }\n      cout << "]" << endl;\n    } catch (const exception& e) {\n        cerr << "Exception caught in main: " << e.what() << endl;\n        cout << "[]" << endl;\n    }\n    return 0;\n}`,
            java: `import java.util.*;\nimport java.io.*;\n\nclass Solution {\n    public List<String> fizzBuzz(int n) {\n        // USER_CODE_HERE\n        return new ArrayList<>();\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n      int n = 0;\n      try {\n        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));\n        String line = reader.readLine();\n        reader.close();\n        n = Integer.parseInt(line.trim());\n        Solution sol = new Solution();\n        List<String> result = sol.fizzBuzz(n);\n        System.out.print("[");\n        for (int i = 0; i < result.size(); i++) {\n            System.out.print("\\\"" + result.get(i).replace("\"", "\\\"") + "\\\"");\n            if (i < result.size() - 1) System.out.print(",");\n        }\n        System.out.println("]");\n      } catch (Exception e) {\n        System.err.println("Exception caught in main: " + e.getMessage());\n        System.out.println("[]");\n      }\n    }\n}`
        },
        visibleTestCases: [
            { input: '3', output: '["1","2","Fizz"]' },
            { input: '5', output: '["1","2","Fizz","4","Buzz"]' },
            { input: '15', output: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]' },
        ],
        hiddenTestCases: [
             { input: '1', output: '["1"]' },
             { input: '2', output: '["1","2"]' },
             { input: '6', output: '["1","2","Fizz","4","Buzz","Fizz"]' },
             { input: '10', output: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz"]' },
             { input: '0', output: '[]' },
             { input: '7', output: '["1","2","Fizz","4","Buzz","Fizz","7"]' },
             { input: '9', output: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz"]' },
             { input: '16', output: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz","16"]' },
             { input: '30', output: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz","16","17","Fizz","19","Buzz","Fizz","22","23","Fizz","Buzz","26","Fizz","28","29","FizzBuzz"]'},
             { input: '12', output: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz"]'},
        ],
    },
    { // --- Contains Duplicate ---
        title: 'Contains Duplicate',
        description: `
Given an integer array <code>nums</code>, return <code>true</code> if any value appears <strong>at least twice</strong> in the array, and return <code>false</code> if every element is distinct.
<br><br>
<strong>Example 1:</strong>
<br>
<strong>Input:</strong> [1, 2, 3, 1]
<br>
<strong>Output:</strong> true
<br><br>
<strong>Example 2:</strong>
<br>
<strong>Input:</strong> [1, 2, 3, 4]
<br>
<strong>Output:</strong> false
        `,
        category: 'Array',
        difficulty: 'Easy',
         starterCode: {
            cpp: `#include <vector>\n#include <unordered_set>\n\nusing namespace std;\n\nclass Solution {\npublic:\n    bool containsDuplicate(vector<int>& nums) {\n        // USER_CODE_HERE\n        return false;\n    }\n};`,
            python: `from typing import List\n\nclass Solution:\n    def containsDuplicate(self, nums: List[int]) -> bool:\n        # USER_CODE_HERE\n        pass\n`,
            java: `import java.util.HashSet;\nimport java.util.Set;\n\nclass Solution {\n    public boolean containsDuplicate(int[] nums) {\n        // USER_CODE_HERE\n        return false;\n    }\n}`,
            javascript: `/**\n * @param {number[]} nums\n * @return {boolean}\n */\nvar containsDuplicate = function(nums) {\n    // USER_CODE_HERE\n};\n`
        },
        driverCode: {
            python: `import sys\nimport json\nfrom typing import List\n\nclass Solution:\n    def containsDuplicate(self, nums: List[int]) -> bool:\n        # USER_CODE_HERE\n        pass\n\nif __name__ == '__main__':\n    line = sys.stdin.readline()\n    nums = json.loads(line.strip())\n    sol = Solution()\n    result = sol.containsDuplicate(nums)\n    print(str(result).lower())\n`,
            javascript: `process.stdin.resume();\nprocess.stdin.setEncoding('utf-8');\nlet inputString = '';\nprocess.stdin.on('data', inputStdin => { inputString += inputStdin; });\nprocess.stdin.on('end', _ => {\n    const nums = JSON.parse(inputString.trim());\n    main(nums);\n});\n\n\nfunction main(nums) {\n    // USER_CODE_HERE\n    let result;\n    try {\n      if (typeof containsDuplicate !== 'function') throw new Error('containsDuplicate function not defined');\n      result = containsDuplicate(nums);\n    } catch(e) {\n        result = false;\n        console.error("Runtime Error:", e.message);\n    }\n    console.log(result ? 'true' : 'false');\n}\n`,
            cpp: `#include <iostream>\n#include <vector>\n#include <string>\n#include <sstream>\n#include <unordered_set>\n#include <stdexcept>\n\nusing namespace std;\n\nvector<int> parseVector(const string& str) {\n    vector<int> result;\n     if (str.length() <= 2) return result;\n    stringstream ss(str.substr(1, str.length() - 2));\n    string num_str;\n    while (getline(ss, num_str, ',')) { \n        num_str.erase(0, num_str.find_first_not_of(" \t"));\n        num_str.erase(num_str.find_last_not_of(" \t") + 1);\n        if (!num_str.empty()) try { result.push_back(stoi(num_str)); } catch(...) {}\n    }\n    return result;\n}\n\nclass Solution {\npublic:\n    // USER_CODE_HERE\n    bool containsDuplicate(vector<int>& nums) {\n        return false;\n    }\n};\n\nint main() {\n    string line;\n    vector<int> nums;\n    try {\n      getline(cin, line);\n      nums = parseVector(line);\n      Solution sol;\n      bool result = sol.containsDuplicate(nums);\n      cout << (result ? "true" : "false") << endl;\n    } catch(const exception& e) {\n        cerr << "Exception caught in main: " << e.what() << endl;\n        cout << "false" << endl;\n    }\n    return 0;\n}`,
            java: `import java.util.*;\nimport java.io.*;\n\nclass Solution {\n    // USER_CODE_HERE\n     public boolean containsDuplicate(int[] nums) {\n        return false;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n      int[] nums = {};\n      try {\n        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));\n        String line = reader.readLine();\n        reader.close();\n        String numsStr = line.trim();\n        String content = numsStr.substring(1, numsStr.length() - 1);\n        if (!content.isEmpty()) {\n            String[] numsArrStr = content.split(",");\n            nums = new int[numsArrStr.length];\n            for (int i = 0; i < numsArrStr.length; i++) { nums[i] = Integer.parseInt(numsArrStr[i].trim()); }\n        }\n        Solution sol = new Solution();\n        boolean result = sol.containsDuplicate(nums);\n        System.out.println(result);\n      } catch (Exception e) {\n          System.err.println("Exception caught in main: " + e.getMessage());\n          System.out.println("false");\n      }\n    }\n}`
        },
        visibleTestCases: [
            { input: '[1, 2, 3, 1]', output: 'true' },
            { input: '[1, 2, 3, 4]', output: 'false' },
            { input: '[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]', output: 'true' },
        ],
        hiddenTestCases: [
             { input: '[]', output: 'false' },
             { input: '[1]', output: 'false' },
             { input: '[1, 5, -2, 4, -2]', output: 'true' },
             { input: '[0, 1, 2, 3, 4, 5]', output: 'false' },
             { input: '[10, 20, 30, 10]', output: 'true' },
             { input: '[0, 0]', output: 'true' },
             { input: '[-1, -2, -3, -1]', output: 'true' },
             { input: '[1000000000, 1000000000, 11]', output: 'true' },
             { input: '[-1, 1, 0]', output: 'false' },
             { input: '[5,4,3,2,1,5]', output: 'true' },
        ],
    },
     { // --- Reverse String ---
        title: 'Reverse String',
        description: `
Write a function that reverses a string. The input string is given as an array of characters <code>s</code>.
<br><br>
You must do this by <strong>modifying the input array in-place</strong> with <code>O(1)</code> extra memory.
<br><br>
<strong>Example 1:</strong>
<br>
<strong>Input:</strong> ["h", "e", "l", "l", "o"]
<br>
<strong>Output:</strong> ["o", "l", "l", "e", "h"]
        `,
        category: 'String',
        difficulty: 'Easy',
         starterCode: {
            python: `from typing import List\n\nclass Solution:\n    def reverseString(self, s: List[str]) -> None:\n        """\n        Do not return anything, modify s in-place instead.\n        """\n        # USER_CODE_HERE\n        pass\n`,
            javascript: `/**\n * @param {character[]} s\n * @return {void} Do not return anything, modify s in-place instead.\n */\nvar reverseString = function(s) {\n    // USER_CODE_HERE\n};\n`,
            cpp: `#include <vector>\n#include <algorithm>\n\nusing namespace std;\n\nclass Solution {\npublic:\n    void reverseString(vector<char>& s) {\n        // USER_CODE_HERE\n    }\n};`,
            java: `class Solution {\n    public void reverseString(char[] s) {\n        // USER_CODE_HERE\n    }\n}`
        },
        driverCode: {
            python: `import sys\nimport json\nfrom typing import List\n\nclass Solution:\n    def reverseString(self, s: List[str]) -> None:\n        # USER_CODE_HERE\n        pass \n\nif __name__ == '__main__':\n    line = sys.stdin.readline()\n    s = json.loads(line.strip())\n    sol = Solution()\n    try:\n        sol.reverseString(s) \n    except Exception as e:\n        print(f"Runtime Error: {e}", file=sys.stderr)\n    print(json.dumps(s).replace(" ", ""))\n`,
            javascript: `process.stdin.resume();\nprocess.stdin.setEncoding('utf-8');\nlet inputString = '';\nprocess.stdin.on('data', inputStdin => { inputString += inputStdin; });\nprocess.stdin.on('end', _ => {\n    const s = JSON.parse(inputString.trim());\n    main(s);\n});\n\n// USER_CODE_HERE\n\nfunction main(s) {\n    try {\n        if (typeof reverseString !== 'function') throw new Error('reverseString function not defined');\n        reverseString(s);\n    } catch (e) {\n        console.error("Runtime Error:", e.message);\n    }\n    console.log(JSON.stringify(s));\n}\n`,
            cpp: `#include <iostream>\n#include <vector>\n#include <string>\n#include <sstream>\n#include <algorithm>\n#include <stdexcept>\n\nusing namespace std;\n\nvector<char> parseCharVector(const string& str) {\n    vector<char> result;\n    if (str.length() <= 2) return result;\n    stringstream ss(str.substr(1, str.length() - 2));\n    string char_str;\n    while (getline(ss, char_str, ',')) {\n        char_str.erase(0, char_str.find_first_not_of(" \t\\""));\n        char_str.erase(char_str.find_last_not_of(" \t\\"") + 1);\n        if (!char_str.empty()) { result.push_back(char_str[0]); }\n    }\n    return result;\n}\n\nclass Solution {\npublic:\n    // USER_CODE_HERE\n    void reverseString(vector<char>& s) {\n    }\n};\n\nint main() {\n    string line;\n    vector<char> s;\n    try {\n      getline(cin, line);\n      s = parseCharVector(line);\n      Solution sol;\n      sol.reverseString(s);\n      cout << "[";\n      for (size_t i = 0; i < s.size(); ++i) { cout << "\\\"" << s[i] << "\\\"" << (i == s.size() - 1 ? "" : ","); }\n      cout << "]" << endl;\n    } catch (const exception& e) {\n        cerr << "Exception caught in main: " << e.what() << endl;\n        cout << "[]" << endl;\n    }\n    return 0;\n}`,
            java: `import java.util.*;\nimport java.io.*;\n\nclass Solution {\n    // USER_CODE_HERE\n     public void reverseString(char[] s) {\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n      char[] s = {};\n      try {\n        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));\n        String line = reader.readLine();\n        reader.close();\n        String sStr = line.trim();\n        String content = sStr.substring(1, sStr.length() - 1);\n        if (content.isEmpty()) {\n             s = new char[0];\n        } else {\n            String[] sArrStr = content.split(",");\n            s = new char[sArrStr.length];\n            for (int i = 0; i < sArrStr.length; i++) { \n                String trimmed = sArrStr[i].trim(); \n                if (trimmed.length() >= 2) { s[i] = trimmed.substring(1, trimmed.length() - 1).charAt(0); }\n            }\n        }\n        Solution sol = new Solution();\n        sol.reverseString(s);\n        System.out.print("[");\n        for(int i = 0; i < s.length; i++){ System.out.print("\\\"" + s[i] + "\\\""); if(i < s.length - 1) System.out.print(","); }\n        System.out.println("]");\n      } catch (Exception e) {\n          System.err.println("Exception caught in main: " + e.getMessage());\n          System.out.println("[]");\n      }\n    }\n}`
        },
        visibleTestCases: [
            { input: '["h","e","l","l","o"]', output: '["o","l","l","e","h"]' },
            { input: '["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]' },
            { input: '["a","b"]', output: '["b","a"]' },
        ],
        hiddenTestCases: [
             { input: '["a"]', output: '["a"]' },
             { input: '[]', output: '[]' },
             { input: '["1","2","3"]', output: '["3","2","1"]' },
             { input: '["R","o","m","e"]', output: '["e","m","o","R"]' },
             { input: '["S","w","a","p"]', output: '["p","a","w","S"]' },
             { input: '["A","B","C","D","E"]', output: '["E","D","C","B","A"]' },
             { input: '["z","y","x"]', output: '["x","y","z"]' },
             { input: '["p","l","a","n"]', output: '["n","a","l","p"]'},
             { input: '["t","e","s","t"]', output: '["t","s","e","t"]'},
             { input: '[" "]', output: '[" "]'},
        ],
    },
    { // --- Valid Anagram ---
        title: 'Valid Anagram',
        description: `
Given two strings <code>s</code> and <code>t</code>, return <code>true</code> if <code>t</code> is an anagram of <code>s</code>, and <code>false</code> otherwise.
<br><br>
An <strong>Anagram</strong> is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.
<br><br>
<strong>Example 1:</strong>
<br>
<strong>Input:</strong> "anagram", "nagaram"
<br>
<strong>Output:</strong> true
<br><br>
<strong>Example 2:</strong>
<br>
<strong>Input:</strong> "rat", "car"
<br>
<strong>Output:</strong> false
<br><br>
<strong>Constraints:</strong>
<ul>
  <li><code>1 &lt;= s.length, t.length &lt;= 5 * 10^4</code></li>
  <li><code>s</code> and <code>t</code> consist of lowercase English letters.</li>
</ul>`,
        category: 'String',
        difficulty: 'Easy',
        starterCode: {
            cpp: `#include <string>\n#include <unordered_map>\n\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isAnagram(string s, string t) {\n        // USER_CODE_HERE\n        return false;\n    }\n};`,
            python: `from typing import List\n\nclass Solution:\n    def isAnagram(self, s: str, t: str) -> bool:\n        # USER_CODE_HERE\n        pass\n`,
            java: `import java.util.HashMap;\n\nclass Solution {\n    public boolean isAnagram(String s, String t) {\n        // USER_CODE_HERE\n        return false;\n    }\n}`,
            javascript: `/**\n * @param {string} s\n * @param {string} t\n * @return {boolean}\n */\nvar isAnagram = function(s, t) {\n    // USER_CODE_HERE\n};\n`
        },
         driverCode: {
            python: `import sys\nimport json\nfrom typing import List\n\nclass Solution:\n    def isAnagram(self, s: str, t: str) -> bool:\n        # USER_CODE_HERE\n        pass\n\nif __name__ == '__main__':\n    lines = sys.stdin.read().splitlines()\n    s = json.loads(lines[0])\n    t = json.loads(lines[1])\n    sol = Solution()\n    result = sol.isAnagram(s, t)\n    print(str(result).lower())\n`,
            javascript: `process.stdin.resume();\nprocess.stdin.setEncoding('utf-8');\nlet inputString = '';\nprocess.stdin.on('data', inputStdin => { inputString += inputStdin; });\nprocess.stdin.on('end', _ => {\n    inputString = inputString.trim().split('\\n').map(str => str.trim());\n    const s = JSON.parse(inputString[0]);\n    const t = JSON.parse(inputString[1]);\n    main(s, t);\n});\n\n\nfunction main(s, t) {\n    // USER_CODE_HERE\n    let result;\n    try {\n      if (typeof isAnagram !== 'function') throw new Error('isAnagram function not defined');\n      result = isAnagram(s, t);\n    } catch(e) {\n        result = false;\n        console.error("Runtime Error:", e.message);\n    }\n    console.log(result ? 'true' : 'false');\n}\n`,
            cpp: `#include <iostream>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\n#include <stdexcept>\n\nusing namespace std;\n\nclass Solution {\npublic:\n    // USER_CODE_HERE\n    bool isAnagram(string s, string t) {\n        return false;\n    }\n};\n\nint main() {\n    string line1, line2;\n    string s_str, t_str;\n    try {\n      getline(cin, line1);\n      getline(cin, line2);\n      // Parse JSON-like strings: "anagram"\n      s_str = line1.substr(1, line1.length() - 2);\n      t_str = line2.substr(1, line2.length() - 2);\n      \n      Solution sol;\n      bool result = sol.isAnagram(s_str, t_str);\n      cout << (result ? "true" : "false") << endl;\n    } catch (const exception& e) {\n        cerr << "Exception caught in main: " << e.what() << endl;\n        cout << "false" << endl;\n    }\n    return 0;\n}`,
            java: `import java.util.*;\nimport java.io.*;\n\nclass Solution {\n    // USER_CODE_HERE\n     public boolean isAnagram(String s, String t) {\n        return false;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n      String s = "";\n      String t = "";\n      try {\n        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));\n        String line1 = reader.readLine();\n        String line2 = reader.readLine();\n        reader.close();\n        String sStr = line1.trim();\n        String tStr = line2.trim();\n        s = sStr.substring(1, sStr.length() - 1).replace("\\\\\"", "\"");\n        t = tStr.substring(1, tStr.length() - 1).replace("\\\\\"", "\"");\n        Solution sol = new Solution();\n        boolean result = sol.isAnagram(s, t);\n        System.out.println(result);\n      } catch (Exception e) {\n          System.err.println("Exception caught in main: " + e.getMessage());\n          System.out.println("false");\n      }\n    }\n}`
        },
        visibleTestCases: [
          { input: '"anagram"\n"nagaram"', output: "true" },
          { input: '"rat"\n"car"', output: "false" },
          { input: '"listen"\n"silent"', output: "true" },
        ],
        hiddenTestCases: [
           { input: '"hello"\n"world"', output: "false" },
           { input: '"a"\n"b"', output: "false" },
           { input: '"aacc"\n"ccac"', output: "false" },
           { input: '""\n""', output: "true" },
           { input: '"rail safety"\n"fairy tales"', output: "true" },
           { input: '"a gentleman"\n"elegant man"', output: "true" },
           { input: '"dormitory"\n"dirty room"', output: "true" },
           { input: '"aabb"\n"bbaa"', output: "true" },
           { input: '"aabbc"\n"bbaac"', output: "true" },
           { input: '"topcoder"\n"codertop"', output: "true" },
        ],
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
        const categoryMap = createdCategories.reduce((acc, cat) => { acc[cat.name] = cat._id; return acc; }, {});
        const questionsWithCategoryIds = seedQuestions.map(q => ({
            ...q,
            description: q.description.trim(),
            category: categoryMap[q.category]
        }));
        console.log('Inserting questions with starter and driver code...');
        await Question.insertMany(questionsWithCategoryIds);
        console.log('Questions inserted successfully.');
    } catch (error) {
        console.error('Error during database seeding:', error.message);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('Database disconnected.');
    }
};

seedDatabase();