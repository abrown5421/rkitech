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

async function fetchThemes(): Promise<Theme[]> {
  try {
    const response = await axios.get(`${API_URL}/api/themes`);
    return response.data.data;
  } catch (error) {
    console.error(" Error fetching themes:", error);
    return [];
  }
}

async function deleteTheme(themeId: string): Promise<boolean> {
  try {
    const response = await axios.delete(`${API_URL}/api/themes/${themeId}`);
    return response.status === 200;
  } catch (error) {
    console.error(" Error deleting theme:", error);
    return false;
  }
}

export async function deleteThemeWizard() {
  console.clear();
  console.log("🗑️  Delete Theme\n");

  const themes = await fetchThemes();

  if (themes.length === 0) {
    console.log("  No themes found to delete.");
    return;
  }

  if (themes.length === 1) {
    console.log("  Cannot delete the last remaining theme.");
    return;
  }

  const { themeToDelete } = await inquirer.prompt([
    {
      type: "list",
      name: "themeToDelete",
      message: "Select a theme to delete:",
      choices: [
        ...themes.map(theme => ({
          name: `${theme.name}${theme.active ? " (active)" : ""}`,
          value: theme._id,
        })),
        { name: "Cancel", value: null },
      ],
    },
  ]);

  if (!themeToDelete) {
    console.log(" Deletion cancelled.");
    return;
  }

  const selectedTheme = themes.find(t => t._id === themeToDelete)!;

  if (selectedTheme.active) {
    console.log("\n  Warning: This is the currently active theme.");
    console.log("You may want to select a different active theme first.\n");
  }

  const { confirm } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirm",
      message: `  Are you sure you want to delete '${selectedTheme.name}'? This cannot be undone.`,
      default: false,
    },
  ]);

  if (!confirm) {
    console.log(" Deletion cancelled.");
    return;
  }

  console.log(`\n Deleting theme '${selectedTheme.name}'...\n`);

  const success = await deleteTheme(themeToDelete);

  if (success) {
    console.log(` Theme '${selectedTheme.name}' deleted successfully!`);
    
    if (selectedTheme.active) {
      console.log("\nℹ️  Note: The deleted theme was active. Please select a new active theme.");
    }
  } else {
    console.log(" Failed to delete theme.");
  }
}