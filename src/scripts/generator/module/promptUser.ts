// src/scripts/generator/promptUser.ts

import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export const askModuleName = (question: string): Promise<string> => {
  return new Promise(resolve => {
    rl.question(question, input => resolve(input.trim()));
  });
};

export const closePrompt = () => rl.close();
