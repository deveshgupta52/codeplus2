const fs = require('fs');
const { exec } = require('child_process');

const driver = `import sys
import json
from typing import List

class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # USER_CODE_HERE
        pass

if __name__ == '__main__':
    lines = sys.stdin.read().splitlines()
    nums = json.loads(lines[0])
    target = int(lines[1])
    sol = Solution()
    result = sol.twoSum(nums, target)
    if isinstance(result, list):
        print(json.dumps(sorted(result)).replace(" ", ""))
    else:
        print("[]")
`;

const userCode = `nums_map = {}
for i, num in enumerate(nums):
    complement = target - num
    if complement in nums_map:
        return [nums_map[complement], i]
    nums_map[num] = i
return []`;

const getFullCode = (driver, placeholder, source_code) => {
    const driverLines = driver.split('\n');
    const placeholderLineIndex = driverLines.findIndex(line => line.includes(placeholder));

    if (placeholderLineIndex === -1) {
        throw new Error('Placeholder not found');
    }

    const placeholderLine = driverLines[placeholderLineIndex];
    const placeholderIndentMatch = placeholderLine.match(/^(\s*)/);
    const placeholderIndent = placeholderIndentMatch ? placeholderIndentMatch[0] : '';

    const userLines = source_code.split('\n');
    const indentedUserCode = userLines.map(line => (line.trim() === '' ? '' : placeholderIndent + line)).join('\n');

    let fullCode = driverLines.slice(0, placeholderLineIndex).join('\n') + '\n' +
                   indentedUserCode + '\n' +
                   driverLines.slice(placeholderLineIndex + 1).join('\n');

    // Remove the 'pass' statement
    fullCode = fullCode.replace(new RegExp('^' + placeholderIndent + 'pass *$', 'gm'), '');

    return fullCode;
};

const fullCode = getFullCode(driver, '# USER_CODE_HERE', userCode);

console.log('Full Code:');
console.log(fullCode);

console.log('\n--- Running with input ---');
const input = '[2,7,11,15]\n9';

exec(`echo "${input}" | python3 -c "${fullCode.replace(/"/g, '\\"')}"`, (error, stdout, stderr) => {
    if (error) {
        console.error('Error:', error);
        return;
    }
    console.log('Stdout:', stdout);
    console.log('Stderr:', stderr);
});
