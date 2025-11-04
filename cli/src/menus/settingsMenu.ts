import inquirer from "inquirer";
import { chooseThemeWizard } from "../commands/themes/chooseThemeWizard.js";
import { editThemeWizard } from "../commands/themes/editThemeWizard.js";

export async function settingsMenu() {
  console.clear();
  console.log("Settings Menu\n");

  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: [
        { name: "Choose Theme", value: "choose" },
        { name: "Edit Theme", value: "edit" },
        { name: "Back", value: "back" },
      ],
    },
  ]);

  switch (action) {
    case "choose":
      try {
        await chooseThemeWizard();
        console.log("\n Theme choice completed!");
        await inquirer.prompt([
          {
            type: "input",
            name: "continue",
            message: "Press Enter to continue...",
          },
        ]);
      } catch (error) {
        console.error(" Error choosing theme:", error);
        await inquirer.prompt([
          {
            type: "input",
            name: "continue",
            message: "Press Enter to continue...",
          },
        ]);
      }
      break;
    case "edit":
      try {
        await editThemeWizard();
        console.log("\n Theme edit completed!");
        await inquirer.prompt([
          {
            type: "input",
            name: "continue",
            message: "Press Enter to continue...",
          },
        ]);
      } catch (error) {
        console.error(" Error editing theme:", error);
        await inquirer.prompt([
          {
            type: "input",
            name: "continue",
            message: "Press Enter to continue...",
          },
        ]);
      }
      break;
    case "back":
    default:
      return;
  }

  if (action !== "back") {
    await settingsMenu();
  }
}