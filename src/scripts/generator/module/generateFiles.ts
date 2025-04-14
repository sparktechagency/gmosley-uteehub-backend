// src/scripts/generator/generateFiles.ts

import fs from "fs/promises";
import path from "path";
import { getTemplates } from "./getTemplates";

const MODULE_BASE_PATH = path.resolve("src/app/modules");

export const generateFiles = async (moduleName: string) => {
  const modulePath = path.join(MODULE_BASE_PATH, moduleName);
  const templates = getTemplates(modulePath);

  try {
    await fs.mkdir(modulePath, { recursive: true });

    for (const [file, content] of Object.entries(templates)) {
      const filePath = path.join(modulePath, `${moduleName}.${file}`);
      await fs.writeFile(filePath, content.trim());
      console.log(`Created: ${filePath}`);
    }

    console.log(`${moduleName} module generated.`);
  } catch (err) {
    console.error("Error generating module:", err);
  }
};
