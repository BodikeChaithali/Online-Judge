export const problems = [
  {
    id: 1,
    title: "Sum of Two Integers",
    difficulty: "Easy",
    tags: ["Math"],
    statement:
      "Given two integers a and b, return the sum of the two integers.",
    examples: [
      {
        input: "a = 1, b = 2",
        output: "3",
      },
    ],
    constraints: ["-1000 <= a, b <= 1000"],
    inputFormat: "The first line has two integers a and b.",
    outputFormat: "The sum of the two integers.",
  },
  {
    id: 2,
    title: "Multiply Two Numbers",
    difficulty: "Easy",
    tags: ["Math"],
    statement:
      "Given two integers a and b, return the product of the two integers.",
    inputFormat: "The first line has two integers a and b.",
    outputFormat: "The product of the two integers.",
    examples: [
      {
        input: "a = 3, b = 4",
        output: "12",
      },
    ],
    constraints: ["-1000 <= a, b <= 1000", "Only one valid answer exists"],
  },
  {
    id: 3,
    title: "Reverse a Array",
    difficulty: "Easy",
    tags: ["Array"],
    statement:
      "Given an array of integers, return the array with elements in reverse order.",
    inputFormat: "The first line contains an integer n.\nThe second line contains n space-separated integers.",
    outputFormat: "The array with elements in reverse order.",
    examples: [
      {
        input: "[1, 2, 3, 4, 5]",
        output: "[5, 4, 3, 2, 1]",
      },
    ],
    constraints: ["1 <= array length <= 1000", "-1000 <= array[i] <= 1000"],
  },
  {
    id: 4,
    title: "Find the Largest Number",
    difficulty: "Medium",
    tags: ["Array"],
    statement:
      "Given an array of integers, return the largest number in the array.",
    inputFormat: "The first line has one integer n.\nThe second line conatins n integers with space between them.",
    outputFormat: "The largest number in the array.",
    examples: [
      {
        input: "[1, 5, 3, 9, 2]",
        output: "9",
      },
    ],
    constraints: ["1 <= array length <= 1000", "-1000 <= array[i] <= 1000"],  
  },
  {
    id: 5,
    title: "Check for Palindrome",
    difficulty: "Medium",
    tags: ["String"],
    statement:
      "Given a string s, return true if s is a palindrome, and false otherwise.",
    inputFormat: "A string s.",
    outputFormat: "true if s is a palindrome, false otherwise.",
    examples: [
      {
        input: "s = 'racecar'",
        output: "true",
      },
      {
        input: "The First line contains a String.",
        output: "false",
      },
    ],
    constraints: ["1 <= s.length <= 1000", "s consists of lowercase English letters."],
  },
  {
    id: 6,
    title: "Fibonacci Number",
    difficulty: "Medium",
    tags: ["Recursion"],
    statement:
      "The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1. Given n, calculate F(n).",
    inputFormat: "An integer n.",
    outputFormat: "The nth Fibonacci number.",
    examples: [
      {
        input: "n = 5",
        output: "5",
      },
      {
        input: "n = 10",
        output: "55",
      },
    ],
    constraints: ["0 <= n <= 30"],
  },
  {
    id: 7,
    title: "substract two numbers",
    difficulty: "Easy",
    tags: ["Math"],
    statement:
      "Given two integers a and b, return the difference of the two integers.",
    inputFormat: "The first line has two integers a and b.",
    outputFormat: "The difference of the two integers.",
    examples: [
      {
        input: "a = 5, b = 3",
        output: "2",
      },
    ],
    constraints: ["-1000 <= a, b <= 1000", "Only one valid answer exists"],   
  },
  {
    id: 8,
    title: "Divide Two Numbers",
    difficulty: "Easy",
    tags: ["Math"],
    statement:
      "Given two integers a and b, return the quotient of the two integers.",
    inputFormat: "The first line has two integers a and b.",
    outputFormat: "The quotient of the two integers.",
    examples: [
      {
        input: "a = 10, b = 2",
        output: "5",
      },
    ],
    constraints: ["-1000 <= a, b <= 1000", "b != 0", "Only one valid answer exists"],
  }
];

export const starterCode = {
  Java: `public class Main {
    public static void main(String[] args) {
      // your code here
    }
}`,

  C: `#include <stdio.h>

int main() {
    // your code here
    return 0;
}`,

  CPP: `#include <iostream>
using namespace std;

int main() {
    // your code here
    return 0;
}`,

  Python: `# Write your code here
`,
};
