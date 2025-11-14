#!/usr/bin/env node
import figlet from "figlet";
import { spawn } from "child_process";
console.clear();
console.log(
  figlet.textSync("RKITECH-FRONTEND", {
    horizontalLayout: "default",
    verticalLayout: "default",
  })
);

console.log("\nWelcome to the RKITECH frontend server!\n");

const vite = spawn("vite", ["--clearScreen=false"], {
  stdio: "inherit",
  shell: true,
});

vite.on("close", (code) => process.exit(code));
