import inquirer from "inquirer";
import fs from "fs";
import path from "path";

const FRONTEND_CSS_PATH = path.join(process.cwd(), "../frontend/src/index.css");

const AVAILABLE_THEMES = [
  { name: "Light Theme (custom)", value: "light" },
  { name: "Dark Theme (custom)", value: "dark" },
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

interface ThemeColors {
  primary: string;
  primaryContent: string;
  secondary: string;
  secondaryContent: string;
  accent: string;
  accentContent: string;
}

function extractThemeColors(cssContent: string, themeName: string): ThemeColors | null {
  const themeRegex = new RegExp(
    `@plugin "daisyui/theme" {[^}]*name: "${themeName}";[^}]*--color-primary: ([^;]+);[^}]*--color-primary-content: ([^;]+);[^}]*--color-secondary: ([^;]+);[^}]*--color-secondary-content: ([^;]+);[^}]*--color-accent: ([^;]+);[^}]*--color-accent-content: ([^;]+);[^}]*}`,
    "s"
  );

  const match = cssContent.match(themeRegex);
  if (!match) return null;

  return {
    primary: match[1].trim(),
    primaryContent: match[2].trim(),
    secondary: match[3].trim(),
    secondaryContent: match[4].trim(),
    accent: match[5].trim(),
    accentContent: match[6].trim(),
  };
}

function createThemeBlock(themeName: string, colors: ThemeColors): string {
  return `@plugin "daisyui/theme" {
  name: "${themeName}";
  default: true;
  --color-primary: ${colors.primary};
  --color-primary-content: ${colors.primaryContent};
  --color-secondary: ${colors.secondary};
  --color-secondary-content: ${colors.secondaryContent};
  --color-accent: ${colors.accent};
  --color-accent-content: ${colors.accentContent};
}`;
}

function updateThemeInCSS(
  cssContent: string,
  themeName: string,
  colors: ThemeColors
): string {
  const themeRegex = new RegExp(
    `@plugin "daisyui/theme" {[^}]*name: "${themeName}";[^}]*}`,
    "s"
  );

  const newThemeBlock = createThemeBlock(themeName, colors);

  if (themeRegex.test(cssContent)) {
    return cssContent.replace(themeRegex, newThemeBlock);
  } else {
    const lastThemeIndex = cssContent.lastIndexOf('@plugin "daisyui/theme"');
    if (lastThemeIndex === -1) {
      const daisyuiPluginIndex = cssContent.indexOf('@plugin "daisyui"');
      if (daisyuiPluginIndex !== -1) {
        const insertPoint = cssContent.indexOf('}', daisyuiPluginIndex) + 1;
        return cssContent.slice(0, insertPoint) + '\n\n' + newThemeBlock + cssContent.slice(insertPoint);
      }
    } else {
      const startIndex = lastThemeIndex;
      const endIndex = cssContent.indexOf('}', startIndex) + 1;
      return cssContent.slice(0, endIndex) + '\n\n' + newThemeBlock + cssContent.slice(endIndex);
    }
  }
  
  return cssContent;
}

export async function editThemeWizard() {
  console.clear();
  console.log("Edit Theme Colors\n");

  if (!fs.existsSync(FRONTEND_CSS_PATH)) {
    console.error(` Could not find index.css at ${FRONTEND_CSS_PATH}`);
    console.error("Make sure you're running this from the cli/ directory");
    return;
  }

  const { theme } = await inquirer.prompt([
    {
      type: "list",
      name: "theme",
      message: "Which theme would you like to edit?",
      choices: AVAILABLE_THEMES,
    },
  ]);

  try {
    let cssContent = fs.readFileSync(FRONTEND_CSS_PATH, "utf8");

    const currentColors = extractThemeColors(cssContent, theme);
    
    if (currentColors) {
      console.log(`\nCurrent ${theme} theme colors:`);
      console.log(`  Primary: ${currentColors.primary}`);
      console.log(`  Primary Content: ${currentColors.primaryContent}`);
      console.log(`  Secondary: ${currentColors.secondary}`);
      console.log(`  Secondary Content: ${currentColors.secondaryContent}`);
      console.log(`  Accent: ${currentColors.accent}`);
      console.log(`  Accent Content: ${currentColors.accentContent}\n`);
    } else {
      console.log(`\n⚠️  ${theme} theme not found in CSS. Creating new custom theme.\n`);
    }

    const { colorToEdit } = await inquirer.prompt([
      {
        type: "list",
        name: "colorToEdit",
        message: "Which color would you like to edit?",
        choices: [
          { 
            name: currentColors ? `Primary (${currentColors.primary})` : "Primary", 
            value: "primary" 
          },
          { 
            name: currentColors ? `Primary Content (${currentColors.primaryContent})` : "Primary Content", 
            value: "primaryContent" 
          },
          { 
            name: currentColors ? `Secondary (${currentColors.secondary})` : "Secondary", 
            value: "secondary" 
          },
          { 
            name: currentColors ? `Secondary Content (${currentColors.secondaryContent})` : "Secondary Content", 
            value: "secondaryContent" 
          },
          { 
            name: currentColors ? `Accent (${currentColors.accent})` : "Accent", 
            value: "accent" 
          },
          { 
            name: currentColors ? `Accent Content (${currentColors.accentContent})` : "Accent Content", 
            value: "accentContent" 
          },
          { name: "Edit All Colors", value: "all" },
        ],
      },
    ]);

    const defaultColors: ThemeColors = {
      primary: "#fe9a00",
      primaryContent: "#f8fafc",
      secondary: "#314158",
      secondaryContent: "#f8fafc",
      accent: "#CAD5E2",
      accentContent: "#314158",
    };

    const newColors = currentColors ? { ...currentColors } : { ...defaultColors };

    if (colorToEdit === "all") {
      const answers = await inquirer.prompt([
        { 
          type: "input", 
          name: "primary", 
          message: "Primary color (hex):", 
          default: newColors.primary 
        },
        { 
          type: "input", 
          name: "primaryContent", 
          message: "Primary content color (hex):", 
          default: newColors.primaryContent 
        },
        { 
          type: "input", 
          name: "secondary", 
          message: "Secondary color (hex):", 
          default: newColors.secondary 
        },
        { 
          type: "input", 
          name: "secondaryContent", 
          message: "Secondary content color (hex):", 
          default: newColors.secondaryContent 
        },
        { 
          type: "input", 
          name: "accent", 
          message: "Accent color (hex):", 
          default: newColors.accent 
        },
        { 
          type: "input", 
          name: "accentContent", 
          message: "Accent content color (hex):", 
          default: newColors.accentContent 
        },
      ]);

      Object.assign(newColors, answers);
    } else {
      const { newColor } = await inquirer.prompt([
        {
          type: "input",
          name: "newColor",
          message: `Enter new ${colorToEdit} color (hex):`,
          default: newColors[colorToEdit as keyof ThemeColors],
        },
      ]);

      newColors[colorToEdit as keyof ThemeColors] = newColor;
    }

    const updatedCSS = updateThemeInCSS(cssContent, theme, newColors);

    fs.writeFileSync(FRONTEND_CSS_PATH, updatedCSS, "utf8");

    console.log(`\n ${theme} theme colors updated successfully!`);
    console.log(` Updated: ${FRONTEND_CSS_PATH}`);
    
    if (!currentColors) {
      console.log(`\n New custom theme "${theme}" has been created!`);
    }
  } catch (error) {
    console.error(" Error updating theme colors:", error);
    throw error;
  }
}