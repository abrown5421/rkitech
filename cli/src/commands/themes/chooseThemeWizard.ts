import inquirer from "inquirer";
import fs from "fs";
import path from "path";

const FRONTEND_HTML_PATH = path.join(process.cwd(), "../frontend/index.html");

const AVAILABLE_THEMES = [
  { name: "Light Theme", value: "light" },
  { name: "Dark Theme", value: "dark" },
  { name: "Cupcake Theme", value: "cupcake" },
  { name: "Bumblebee Theme", value: "bumblebee" },
  { name: "Emerald Theme", value: "emerald" },
  { name: "Corporate Theme", value: "corporate" },
  { name: "Synthwave Theme", value: "synthwave" },
  { name: "Retro Theme", value: "retro" },
  { name: "Cyberpunk Theme", value: "cyberpunk" },
  { name: "Valentine Theme", value: "valentine" },
  { name: "Halloween Theme", value: "halloween" },
  { name: "Garden Theme", value: "garden" },
  { name: "Forest Theme", value: "forest" },
  { name: "Aqua Theme", value: "aqua" },
  { name: "Lofi Theme", value: "lofi" },
  { name: "Pastel Theme", value: "pastel" },
  { name: "Fantasy Theme", value: "fantasy" },
  { name: "Wireframe Theme", value: "wireframe" },
  { name: "Black Theme", value: "black" },
  { name: "Luxury Theme", value: "luxury" },
  { name: "Dracula Theme", value: "dracula" },
  { name: "CMYK Theme", value: "cmyk" },
  { name: "Autumn Theme", value: "autumn" },
  { name: "Business Theme", value: "business" },
  { name: "Acid Theme", value: "acid" },
  { name: "Lemonade Theme", value: "lemonade" },
  { name: "Night Theme", value: "night" },
  { name: "Coffee Theme", value: "coffee" },
  { name: "Winter Theme", value: "winter" },
  { name: "Dim Theme", value: "dim" },
  { name: "Nord Theme", value: "nord" },
  { name: "Sunset Theme", value: "sunset" },
  { name: "Caramellatte Theme", value: "caramellatte" },
  { name: "Abyss Theme", value: "abyss" },
  { name: "Silk Theme", value: "silk" },
];

export async function chooseThemeWizard() {
  console.clear();
  console.log("Choose Theme\n");

  if (!fs.existsSync(FRONTEND_HTML_PATH)) {
    console.error(` Could not find index.html at ${FRONTEND_HTML_PATH}`);
    console.error("Make sure you're running this from the cli/ directory");
    return;
  }

  let currentTheme = "light";
  try {
    const htmlContent = fs.readFileSync(FRONTEND_HTML_PATH, "utf8");
    const themeMatch = htmlContent.match(/data-theme="([^"]+)"/);
    if (themeMatch) {
      currentTheme = themeMatch[1];
    }
  } catch (error) {
    console.warn("⚠️  Could not read current theme, defaulting to light");
  }

  console.log(`Current theme: ${currentTheme}\n`);

  const { theme } = await inquirer.prompt([
    {
      type: "list",
      name: "theme",
      message: "Select a theme:",
      choices: AVAILABLE_THEMES,
      default: currentTheme,
    },
  ]);

  try {
    let htmlContent = fs.readFileSync(FRONTEND_HTML_PATH, "utf8");

    htmlContent = htmlContent.replace(
      /data-theme="[^"]+"/,
      `data-theme="${theme}"`
    );

    fs.writeFileSync(FRONTEND_HTML_PATH, htmlContent, "utf8");

    console.log(`\n Theme successfully changed to "${theme}"!`);
    console.log(` Updated: ${FRONTEND_HTML_PATH}`);
  } catch (error) {
    console.error(" Error updating theme:", error);
    throw error;
  }
}