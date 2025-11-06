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
  neutral: ColorObject;
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