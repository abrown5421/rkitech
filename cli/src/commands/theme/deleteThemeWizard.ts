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

async function deleteTheme(themeId: string): Promise<boolean> {
  try {
    const response = await axios.delete(`${API_URL}/api/themes/${themeId}`);
    return response.status === 200;
  } catch (error) {
    console.error(" Error deleting theme:", error);
    return false;
  }
}
