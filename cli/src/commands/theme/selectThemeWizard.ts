import inquirer from "inquirer";
import axios from "axios";
import dotenv from "dotenv";
import { Theme } from "./themeTypes.js";

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

async function setActiveTheme(themeId: string) {
  try {
    const themes = await fetchThemes();

    for (const theme of themes) {
      if (theme.active && theme._id !== themeId) {
        await axios.put(`${API_URL}/api/themes/${theme._id}`, { active: false });
      }
    }

    await axios.put(`${API_URL}/api/themes/${themeId}`, { active: true });

    return true;
  } catch (err) {
    console.error("Error setting theme:", err);
    return false;
  }
}

export async function selectThemeWizard() {
  console.clear();
  console.log(" Select Active Theme\n");

  const themes = await fetchThemes();

  if (themes.length === 0) {
    console.log("No themes available.");
    return;
  }

  const { selectedTheme } = await inquirer.prompt([
    {
      type: "list",
      name: "selectedTheme",
      message: "Choose a theme to set active:",
      choices: themes.map((t: Theme) => ({
        name: `${t.name}${t.active ? " (active)" : ""}`,
        value: t._id
      })),
    },
  ]);

  console.log("\nUpdating active theme...");

  const success = await setActiveTheme(selectedTheme);

  if (success) console.log("✔ Theme updated successfully!");
  else console.log("✖ Failed to update theme.");
}
