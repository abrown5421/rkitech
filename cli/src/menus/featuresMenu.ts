import inquirer from "inquirer";
import { createFeatureWizard } from "../commands/createFeatureWizard.js";
import { deleteFeatureWizard } from "../commands/deleteFeatureWizard.js";
import { editFeatureWizard } from "../commands/editFeatureWizard.js";

export async function featuresMenu() {
  console.clear();
  console.log("Features Menu\n");

  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: [
        { name: "Create new feature", value: "new" },
        { name: "Edit existing feature", value: "edit" },
        { name: "Delete feature", value: "delete" },
        { name: "Back", value: "back" },
      ],
    },
  ]);

  switch (action) {
    case "new":
      try {
        await createFeatureWizard();
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
      await editFeatureWizard();
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
        await deleteFeatureWizard();
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
    await featuresMenu();
  }
}