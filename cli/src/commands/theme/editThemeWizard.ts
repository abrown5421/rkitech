import inquirer from "inquirer";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_URL = process.env.API_URL || "http://localhost:3001";

interface ColorObject {
  main: string;
  content: string;
}

interface Theme {
  _id: string;
  name: string;
  active: boolean;
  primary: ColorObject;
  secondary: ColorObject;
  accent: ColorObject;
  success: ColorObject;
  warning: ColorObject;
  error: ColorObject;
  nuetral: ColorObject;
}

function isValidHexColor(color: string): boolean {
  return /^#[0-9A-F]{6}$/i.test(color);
}

async function fetchThemes(): Promise<Theme[]> {
  try {
    const response = await axios.get(`${API_URL}/api/themes`);
    return response.data.data;
  } catch (error) {
    console.error(" Error fetching themes:", error);
    return [];
  }
}

async function updateTheme(themeId: string, updates: Partial<Theme>): Promise<boolean> {
  try {
    const response = await axios.put(`${API_URL}/api/themes/${themeId}`, updates);
    return response.status === 200;
  } catch (error) {
    console.error(" Error updating theme:", error);
    return false;
  }
}

async function editColorField(currentColor: ColorObject, fieldName: string): Promise<ColorObject> {
  const { editWhat } = await inquirer.prompt([
    {
      type: "list",
      name: "editWhat",
      message: `Edit ${fieldName}:`,
      choices: [
        { name: `Main color (currently: ${currentColor.main})`, value: "main" },
        { name: `Content color (currently: ${currentColor.content})`, value: "content" },
        { name: "Both colors", value: "both" },
        { name: "Skip", value: "skip" },
      ],
    },
  ]);

  if (editWhat === "skip") {
    return currentColor;
  }

  const newColor = { ...currentColor };

  if (editWhat === "main" || editWhat === "both") {
    const { main } = await inquirer.prompt([
      {
        type: "input",
        name: "main",
        message: `${fieldName} - New main color (hex):`,
        default: currentColor.main,
        validate: (input: string) => {
          if (!isValidHexColor(input)) {
            return "Please enter a valid hex color (e.g., #FF5733)";
          }
          return true;
        },
      },
    ]);
    newColor.main = main.toUpperCase();
  }

  if (editWhat === "content" || editWhat === "both") {
    const { content } = await inquirer.prompt([
      {
        type: "input",
        name: "content",
        message: `${fieldName} - New content color (hex):`,
        default: currentColor.content,
        validate: (input: string) => {
          if (!isValidHexColor(input)) {
            return "Please enter a valid hex color (e.g., #FFFFFF)";
          }
          return true;
        },
      },
    ]);
    newColor.content = content.toUpperCase();
  }

  return newColor;
}

export async function editThemeWizard() {
  console.clear();
  console.log("✏️  Edit Theme\n");

  const themes = await fetchThemes();

  if (themes.length === 0) {
    console.log("  No themes found to edit.");
    return;
  }

  const { themeToEdit } = await inquirer.prompt([
    {
      type: "list",
      name: "themeToEdit",
      message: "Select a theme to edit:",
      choices: [
        ...themes.map(theme => ({
          name: `${theme.name}${theme.active ? " (active)" : ""}`,
          value: theme._id,
        })),
        { name: "Cancel", value: null },
      ],
    },
  ]);

  if (!themeToEdit) {
    console.log(" Edit cancelled.");
    return;
  }

  const selectedTheme = themes.find(t => t._id === themeToEdit)!;
  const updates: Partial<Theme> = {};

  let continueEditing = true;

  while (continueEditing) {
    const { fieldToEdit } = await inquirer.prompt([
      {
        type: "list",
        name: "fieldToEdit",
        message: "What would you like to edit?",
        choices: [
          { name: `Name (currently: ${selectedTheme.name})`, value: "name" },
          { name: `Primary color`, value: "primary" },
          { name: `Secondary color`, value: "secondary" },
          { name: `Accent color`, value: "accent" },
          { name: `Success color`, value: "success" },
          { name: `Warning color`, value: "warning" },
          { name: `Error color`, value: "error" },
          { name: `Neutral color`, value: "nuetral" },
          { name: "Done editing", value: "done" },
        ],
      },
    ]);

    if (fieldToEdit === "done") {
      continueEditing = false;
      break;
    }

    if (fieldToEdit === "name") {
      const { newName } = await inquirer.prompt([
        {
          type: "input",
          name: "newName",
          message: "New theme name:",
          default: selectedTheme.name,
          validate: (input: string) => {
            if (input.trim().length === 0) {
              return "Theme name cannot be empty";
            }
            return true;
          },
        },
      ]);
      updates.name = newName;
      selectedTheme.name = newName;
    } else {
      const colorField = fieldToEdit as keyof Pick<Theme, "primary" | "secondary" | "accent" | "success" | "warning" | "error" | "nuetral">;
      const currentColor = selectedTheme[colorField];
      const newColor = await editColorField(currentColor, fieldToEdit);
      updates[colorField] = newColor;
      selectedTheme[colorField] = newColor;
    }
  }

  if (Object.keys(updates).length === 0) {
    console.log("ℹ️  No changes made.");
    return;
  }

  console.log("\n Changes Summary:");
  Object.entries(updates).forEach(([key, value]) => {
    if (typeof value === "object" && value !== null && "main" in value) {
      console.log(`${key}: ${value.main} / ${value.content}`);
    } else {
      console.log(`${key}: ${value}`);
    }
  });

  const { confirm } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirm",
      message: "\nSave these changes?",
      default: true,
    },
  ]);

  if (!confirm) {
    console.log(" Edit cancelled.");
    return;
  }

  console.log("\n Updating theme...\n");

  const success = await updateTheme(themeToEdit, updates);

  if (success) {
    console.log(` Theme '${selectedTheme.name}' updated successfully!`);
  } else {
    console.log(" Failed to update theme.");
  }
}