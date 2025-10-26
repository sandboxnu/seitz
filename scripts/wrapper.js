#!/usr/bin/env node

import { spawn } from "child_process";
import { platform } from "os";

function findPythonExecutable() {
  return platform() === "win32" ? "python" : "python3";
}

function startApplication() {
  const pythonCmd = findPythonExecutable();
  console.log(`Starting application with ${pythonCmd}...`);
  const child = spawn(pythonCmd, ["./scripts/boot.py"], {
    stdio: "inherit",
    shell: false,
  });

  // Forward signals to child process
  const signals = ["SIGINT", "SIGTERM", "SIGHUP"];
  signals.forEach((signal) => {
    process.on(signal, () => {
      if (child.killed) return;
      child.kill(signal);
    });
  });

  // Handle child process exit
  child.on("exit", (code, signal) => {
    if (signal) {
      console.log(`\nProcess terminated by signal: ${signal}`);
      process.exit(1);
    } else {
      process.exit(code || 0);
    }
  });

  // Handle errors (e.g., python not found)
  child.on("error", (err) => {
    console.error(`Failed to start process: ${err.message}`);
    process.exit(1);
  });
}

startApplication();
