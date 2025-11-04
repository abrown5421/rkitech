#!/usr/bin/env node
import { Command } from "commander";
import figlet from "figlet";
import inquirer from "inquirer";
import { featuresMenu as featuresMenuCommand } from "./menus/featuresMenu.js"; 
import { settingsMenu as settingsMenuCommand } from "./menus/settingsMenu.js"; 

const program = new Command();

program
  .name("rkitech-cli")
  .description("Your CLI for Rkitech")
  .version("0.2.0");

async function mainMenu() {
  console.clear();
  console.log(figlet.textSync("RKITECH", { font: "Big" }));
  console.log("Welcome to RKITECH CLI!\n");

  const { section } = await inquirer.prompt([
    {
      type: "list",
      name: "section",
      message: "What would you like to work on?",
      choices: [
        { name: "Features", value: "features" },
        { name: "Settings", value: "settings" },
        { name: "Exit", value: "exit" },
      ],
    },
  ]);

  switch (section) {
    case "features":
      await featuresMenuCommand();
      break;
    case "settings":
      await settingsMenuCommand();
      break;
    case "exit":
    default:
      console.log("Goodbye!");
      process.exit(0);
  }

  await mainMenu();
}

async function settingsMenu() {
  console.clear();
  console.log("Settings Menu\n");
}

program.action(async () => {
  await mainMenu();
});

program.parse();
