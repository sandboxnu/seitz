#!/usr/bin/env node

import { spawn } from "child_process";
import { platform } from "process";

const pythonCmd = platform === "win32" ? "python" : "python3";
const scriptPath = process.argv[2];

if (!scriptPath) {
  console.error("Usage: node run-python.js <path-to-python-script>");
  process.exit(1);
}

console.log(`Running ${scriptPath} with ${pythonCmd}...`);

const pythonProcess = spawn(pythonCmd, [scriptPath], {
  stdio: "inherit",
});

pythonProcess.on("error", (error) => {
  console.error(`Failed to start Python: ${error.message}`);
  process.exit(1);
});

pythonProcess.on("close", (code) => {
  process.exit(code || 0);
});

process.on("SIGINT", () => {
  pythonProcess.kill("SIGINT");
});

process.on("SIGTERM", () => {
  pythonProcess.kill("SIGTERM");
});
