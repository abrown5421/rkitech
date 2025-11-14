#!/usr/bin/env node
import figlet from "figlet";
import { spawn } from "child_process";

console.log(figlet.textSync("RKITECH-FRONTEND", { horizontalLayout: "default" }));
console.log("\nWelcome to the RKITECH frontend server!\n");

const vite = spawn("vite", ["--clearScreen=false", "--logLevel", "silent"], {
  stdio: ["inherit", "pipe", "pipe"],
  shell: true,
});

vite.stdout.pipe(process.stdout);
vite.stderr.on("data", (data) => {
  const str = data.toString();
  if (!str.includes("Vite requires Node.js version")) {
    process.stderr.write(str);
  }
});

vite.on("close", (code) => process.exit(code));
