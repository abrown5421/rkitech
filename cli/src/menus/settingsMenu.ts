import inquirer from "inquirer";
import { createThemeWizard } from "../commands/theme/createThemeWizard.js";
import { editThemeWizard } from "../commands/theme/editThemeWizard.js";
import { deleteThemeWizard } from "../commands/theme/deleteThemeWizard.js";
import { selectThemeWizard } from "../commands/theme/selectThemeWizard.js";

export async function settingsMenu() {
  console.clear();
  console.log("Features Menu\n");

  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: [
        { name: "Select theme", value: "select" },
        { name: "Create new theme", value: "new" },
        { name: "Edit existing theme", value: "edit" },
        { name: "Delete theme", value: "delete" },
        { name: "Back", value: "back" },
      ],
    },
  ]);

  switch (action) {
    case "select":
      try {
        await selectThemeWizard();
        console.log("\n Feature selection completed!");
        await inquirer.prompt([
          {
            type: "input",
            name: "continue",
            message: "Press Enter to continue...",
          },
        ]);
      } catch (error) {
        console.error(" Error creating feature:", error);
        await inquirer.prompt([
          {
            type: "input",
            name: "continue",
            message: "Press Enter to continue...",
          },
        ]);
      }
      break;
    case "new":
      try {
        await createThemeWizard();
        console.log("\n Feature creation completed!");
        await inquirer.prompt([
          {
            type: "input",
            name: "continue",
            message: "Press Enter to continue...",
          },
        ]);
      } catch (error) {
        console.error(" Error creating feature:", error);
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
      await editThemeWizard();
      await inquirer.prompt([
        {
          type: "input",
          name: "continue",
          message: "Press Enter to continue...",
        },
      ]);
      break;
    case "delete":
      try {
        await deleteThemeWizard();
        await inquirer.prompt([
          {
            type: "input",
            name: "continue",
            message: "Press Enter to continue...",
          },
        ]);
      } catch (error) {
        console.error(" Error deleting feature:", error);
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