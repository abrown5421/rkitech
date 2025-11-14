import inquirer from "inquirer";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_URL = process.env.API_URL || "http://localhost:3001";

async function fetchThemes() {
  try {
    const response = await axios.get(`${API_URL}/api/themes`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching themes:", error);
    return [];
  }
}

async function deleteTheme(themeId: string) {
  try {
    const response = await axios.delete(`${API_URL}/api/themes/${themeId}`);
    return response.status === 200;
  } catch (err) {
    console.error("Error deleting theme:", err);
    return false;
  }
}

export async function deleteThemeWizard() {
  console.clear();
  console.log("🗑 Delete Theme\n");

  const themes = await fetchThemes();

  if (themes.length === 0) {
    console.log("No themes available to delete.");
    return;
  }

  const { themeToDelete } = await inquirer.prompt([
    {
      type: "list",
      name: "themeToDelete",
      message: "Select a theme to delete:",
      choices: themes.map((t: any) => ({
        name: `${t.name}${t.active ? " (active)" : ""}`,
        value: t._id,
      })),
    },
  ]);

  if (!themeToDelete) {
    console.log("Deletion cancelled.");
    return;
  }

  const { confirmDelete } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirmDelete",
      message: "Are you sure? This cannot be undone.",
      default: false,
    },
  ]);

  if (!confirmDelete) {
    console.log("Deletion cancelled.");
    return;
  }

  console.log("\nDeleting theme...");

  const success = await deleteTheme(themeToDelete);

  if (success) console.log(" Theme deleted successfully!");
  else console.log("✖ Failed to delete theme.");
}
