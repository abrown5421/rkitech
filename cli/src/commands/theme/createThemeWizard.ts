import inquirer from "inquirer";
import axios from "axios";
import dotenv from "dotenv";
import { ColorObject, Theme } from "./themeTypes.js";

dotenv.config();

const API_URL = process.env.API_URL || "http://localhost:3001";

function isValidHexColor(color: string): boolean {
  return /^#[0-9A-F]{6}$/i.test(color);
}

async function promptForColor(colorName: string): Promise<ColorObject> {
  const { main, content } = await inquirer.prompt([
    {
      type: "input",
      name: "main",
      message: `${colorName} - Main color (hex):`,
      default: "#000000",
      validate: (input: string) => {
        if (!isValidHexColor(input)) {
          return "Please enter a valid hex color (e.g., #FF5733)";
        }
        return true;
      },
    },
    {
      type: "input",
      name: "content",
      message: `${colorName} - Content color (hex):`,
      default: "#FFFFFF",
      validate: (input: string) => {
        if (!isValidHexColor(input)) {
          return "Please enter a valid hex color (e.g., #FFFFFF)";
        }
        return true;
      },
    },
  ]);

  return { main: main.toUpperCase(), content: content.toUpperCase() };
}

async function createTheme(themeData: Omit<Theme, "_id">): Promise<boolean> {
  try {
    const response = await axios.post(`${API_URL}/api/themes`, themeData);
    return response.status === 201;
  } catch (error) {
    console.error(" Error creating theme:", error);
    return false;
  }
}

export async function createThemeWizard() {
  console.clear();
  console.log(" Create New Theme\n");

  const { name } = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Theme name:",
      validate: (input: string) => {
        if (input.trim().length === 0) {
          return "Theme name cannot be empty";
        }
        return true;
      },
    },
  ]);

  const { setAsActive } = await inquirer.prompt([
    {
      type: "confirm",
      name: "setAsActive",
      message: "Set as active theme?",
      default: false,
    },
  ]);

  console.log("\n Configure theme colors:\n");

  const primary = await promptForColor("Primary");
  const secondary = await promptForColor("Secondary");
  const accent = await promptForColor("Accent");
  const success = await promptForColor("Success");
  const warning = await promptForColor("Warning");
  const error = await promptForColor("Error");
  const neutral = await promptForColor("Neutral");
  const neutral2 = await promptForColor("Neutral 2");
  const neutral3 = await promptForColor("Neutral 3");

  const themeData: Omit<Theme, "_id"> = {
    name,
    active: setAsActive,
    primary,
    secondary,
    accent,
    success,
    warning,
    error,
    neutral,
    neutral2,
    neutral3,
  };

  console.log("\n📋 Theme Summary:");
  console.log(`Name: ${name}`);
  console.log(`Active: ${setAsActive ? "Yes" : "No"}`);
  console.log(`Primary: ${primary.main} / ${primary.content}`);
  console.log(`Secondary: ${secondary.main} / ${secondary.content}`);
  console.log(`Accent: ${accent.main} / ${accent.content}`);
  console.log(`Success: ${success.main} / ${success.content}`);
  console.log(`Warning: ${warning.main} / ${warning.content}`);
  console.log(`Error: ${error.main} / ${error.content}`);
  console.log(`Neutral: ${neutral.main} / ${neutral.content}`);
  console.log(`Neutral 2: ${neutral2.main} / ${neutral2.content}`);
  console.log(`Neutral 3: ${neutral3.main} / ${neutral3.content}`);

  const { confirm } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirm",
      message: "\nCreate this theme?",
      default: true,
    },
  ]);

  if (!confirm) {
    console.log(" Theme creation cancelled.");
    return;
  }

  console.log("\n Creating theme...\n");
  const isCreated = await createTheme(themeData);

  if (isCreated) {
    console.log(` Theme '${name}' created successfully!`);
  } else {
    console.log(" Failed to create theme.");
  }
}