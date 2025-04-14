// src/scripts/generator/index.ts

import { askModuleName, closePrompt } from './promptUser';
import { generateFiles } from './generateFiles';

async function main() {
  while (true) {
    const input = await askModuleName('Enter module name (or "exit" to quit): ');

    if (input.toLowerCase() === 'exit') {
      closePrompt();
      break;
    }

    if (!input) {
      console.log('Please enter a valid module name!');
      continue;
    }

    await generateFiles(input);
  }
}

main();
