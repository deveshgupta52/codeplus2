import sys
import json
from typing import List

class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:        nums_map = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in nums_map:
                return [nums_map[complement], i]
            nums_map[num] = i
        return []


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
