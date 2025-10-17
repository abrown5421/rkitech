#!/usr/bin/env node
import { Command } from "commander";
import figlet from "figlet";
import inquirer from "inquirer";

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
        { name: "Components", value: "components" },
        { name: "Settings", value: "settings" },
        { name: "Exit", value: "exit" },
      ],
    },
  ]);

  switch (section) {
    case "features":
      await featuresMenu();
      break;
    case "components":
      await componentsMenu();
      break;
    case "settings":
      await settingsMenu();
      break;
    case "exit":
    default:
      console.log("Goodbye");
      process.exit(0);
  }

  await mainMenu();
}

async function featuresMenu() {
  console.clear();
  console.log("Features Menu\n");
  await inquirer.prompt([
    { type: "input", name: "return", message: "Press Enter to return to main menu" },
  ]);
}

async function componentsMenu() {
  console.clear();
  console.log("Components Menu\n");
  await inquirer.prompt([
    { type: "input", name: "return", message: "Press Enter to return to main menu" },
  ]);
}

async function settingsMenu() {
  console.clear();
  console.log("Settings Menu\n");
  await inquirer.prompt([
    { type: "input", name: "return", message: "Press Enter to return to main menu" },
  ]);
}

program.action(async () => {
  await mainMenu();
});

program.parse();
