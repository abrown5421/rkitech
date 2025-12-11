#!/usr/bin/env node
import figlet from "figlet";
import chalk from "chalk";
import seedDatabase from "./actions/seedDatabase.js";
import prompts from "prompts";
function clearTerminal() {
    process.stdout.write("\x1B[2J\x1B[0f");
}
function showHeader() {
    console.log(chalk.cyan(figlet.textSync("RKITECH-CLI", { horizontalLayout: "full" })));
    console.log("\n");
}
const menuOptions = [
    { title: "Seed database", value: "seedDatabase" },
    // Add future options here
];
async function showMainMenu() {
    const response = await prompts({
        type: "select",
        name: "action",
        message: "Select an action:",
        choices: menuOptions,
        initial: 0,
    });
    const action = response.action;
    switch (action) {
        case "seedDatabase":
            await seedDatabase();
            break;
        default:
            console.log("Unknown action!");
    }
    await promptReturnToMenu();
}
async function promptReturnToMenu() {
    const { again } = await prompts({
        type: "confirm",
        name: "again",
        message: "Return to main menu?",
        initial: true,
    });
    if (again) {
        await runCLI();
    }
    else {
        console.log(chalk.green("Goodbye!"));
        process.exit(0);
    }
}
async function runCLI() {
    clearTerminal();
    showHeader();
    await showMainMenu();
}
runCLI();
