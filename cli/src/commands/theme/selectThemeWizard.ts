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

async function setActiveTheme(themeId: string): Promise<boolean> {
  try {
    // First, get all themes
    const themes = await fetchThemes();
    
    // Set all themes to inactive
    for (const theme of themes) {
      if (theme._id !== themeId && theme.active) {
        await axios.put(`${API_URL}/api/themes/${theme._id}`, {
          active: false,
        });
      }
    }
    
    // Set the selected theme to active
    await axios.put(`${API_URL}/api/themes/${themeId}`, {
      active: true,
    });
    
    return true;
  } catch (error) {
    console.error(" Error setting active theme:", error);
    return false;
  }
}

export async function selectThemeWizard() {
  console.clear();
  console.log(" Select Active Theme\n");

  const themes = await fetchThemes();

  if (themes.length === 0) {
    console.log("  No themes found. Please create a theme first.");
    return;
  }

  const activeTheme = themes.find(t => t.active);
  
  console.log(`Current active theme: ${activeTheme ? activeTheme.name : "None"}\n`);

  const { selectedThemeId } = await inquirer.prompt([
    {
      type: "list",
      name: "selectedThemeId",
      message: "Select a theme to activate:",
      choices: [
        ...themes.map(theme => ({
          name: `${theme.name}${theme.active ? " (currently active)" : ""}`,
          value: theme._id,
        })),
        { name: "Cancel", value: null },
      ],
    },
  ]);

  if (!selectedThemeId) {
    console.log(" Selection cancelled.");
    return;
  }

  const selectedTheme = themes.find(t => t._id === selectedThemeId);
  
  if (selectedTheme?.active) {
    console.log(`ℹ️  Theme '${selectedTheme.name}' is already active.`);
    return;
  }

  console.log(`\n Setting '${selectedTheme?.name}' as active theme...\n`);

  const success = await setActiveTheme(selectedThemeId);

  if (success) {
    console.log(` Theme '${selectedTheme?.name}' is now active!`);
  } else {
    console.log(" Failed to set active theme.");
  }
}