import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface FieldConfig {
  type: string;
  required: boolean;
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function generateTypeScriptInterface(
  featureName: string,
  schema: Record<string, FieldConfig>
): string {
  const interfaceName = `I${capitalizeFirst(featureName)}`;
  const fields = Object.entries(schema)
    .map(([fieldName, config]) => {
      const optional = config.required ? "" : "?";
      let tsType = "string";
      
      switch (config.type) {
        case "Number":
          tsType = "number";
          break;
        case "Boolean":
          tsType = "boolean";
          break;
        case "Date":
          tsType = "Date";
          break;
        default:
          tsType = "string";
      }
      
      return `  ${fieldName}${optional}: ${tsType};`;
    })
    .join("\n");

  return `export interface ${interfaceName} {
  _id?: string;
${fields}
  createdAt?: Date;
  updatedAt?: Date;
}`;
}

function generateRTKQueryApi(featureName: string): string {
  const interfaceName = `I${capitalizeFirst(featureName)}`;
  const featureLower = featureName.toLowerCase();
  const tagType = capitalizeFirst(featureName);

  return `import { baseApi } from '../../store/api/baseApi';
import type { ${interfaceName} } from './${featureLower}Types';

export const ${featureLower}Api = baseApi.injectEndpoints({
  endpoints: (build) => ({
    get${capitalizeFirst(featureName)}s: build.query<${interfaceName}[], void>({
      query: () => '/${featureLower}',
      providesTags: ['${tagType}'],
      transformResponse: (response: any) => response.data,
    }),

    get${capitalizeFirst(featureName)}ById: build.query<${interfaceName}, string>({
      query: (id) => \`/${featureLower}/\${id}\`,
      providesTags: (_result, _error, id) => [{ type: '${tagType}', id }],
      transformResponse: (response: any) => response.data,
    }),

    create${capitalizeFirst(featureName)}: build.mutation<${interfaceName}, Partial<${interfaceName}>>({
      query: (body) => ({
        url: '/${featureLower}',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['${tagType}'],
    }),

    update${capitalizeFirst(featureName)}: build.mutation<${interfaceName}, { id: string; data: Partial<${interfaceName}> }>({
      query: ({ id, data }) => ({
        url: \`/${featureLower}/\${id}\`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: '${tagType}', id }],
    }),

    delete${capitalizeFirst(featureName)}: build.mutation<void, string>({
      query: (id) => ({
        url: \`/${featureLower}/\${id}\`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: '${tagType}', id }],
    }),
  }),
});

export const {
  useGet${capitalizeFirst(featureName)}sQuery,
  useGet${capitalizeFirst(featureName)}ByIdQuery,
  useCreate${capitalizeFirst(featureName)}Mutation,
  useUpdate${capitalizeFirst(featureName)}Mutation,
  useDelete${capitalizeFirst(featureName)}Mutation,
} = ${featureLower}Api;
`;
}

export function createFrontendFeature(
  featureName: string,
  schema: Record<string, FieldConfig>
): boolean {
  try {
    const featureLower = featureName.toLowerCase();
    const frontendDir = path.resolve(__dirname, "../../../frontend/src/features", featureLower);

    if (!fs.existsSync(frontendDir)) {
      fs.mkdirSync(frontendDir, { recursive: true });
    }

    const typesContent = generateTypeScriptInterface(featureName, schema);
    const typesPath = path.join(frontendDir, `${featureLower}Types.ts`);
    fs.writeFileSync(typesPath, typesContent, "utf-8");
    console.log(` Created: ${typesPath}`);

    const apiContent = generateRTKQueryApi(featureName);
    const apiPath = path.join(frontendDir, `${featureLower}Api.ts`);
    fs.writeFileSync(apiPath, apiContent, "utf-8");
    console.log(` Created: ${apiPath}`);

    updateBaseApiTags(featureName);

    return true;
  } catch (error) {
    console.error(` Error creating frontend feature:`, error);
    return false;
  }
}

function updateBaseApiTags(featureName: string): void {
  const baseApiPath = path.resolve(__dirname, "../../../frontend/src/store/api/baseApi.ts");
  
  if (!fs.existsSync(baseApiPath)) {
    console.warn(`  baseApi.ts not found at ${baseApiPath}`);
    return;
  }

  let content = fs.readFileSync(baseApiPath, "utf-8");
  const tagType = capitalizeFirst(featureName);

  if (content.includes(`'${tagType}'`)) {
    console.log(`  Tag '${tagType}' already exists in baseApi`);
    return;
  }
  const tagTypesRegex = /tagTypes:\s*\[([\s\S]*?)\]/;
  const match = content.match(tagTypesRegex);

  if (match) {
    const existingTags = match[1].trim();
    const newTags = existingTags 
      ? `${existingTags}, '${tagType}'`
      : `'${tagType}'`;
    
    content = content.replace(
      tagTypesRegex,
      `tagTypes: [${newTags}]`
    );

    fs.writeFileSync(baseApiPath, content, "utf-8");
    console.log(` Added '${tagType}' tag to baseApi`);
  } else {
    console.warn(`  Could not find tagTypes array in baseApi`);
  }
}

export function deleteFrontendFeature(featureName: string): boolean {
  try {
    const featureLower = featureName.toLowerCase();
    const frontendDir = path.resolve(__dirname, "../../../frontend/src/features", featureLower);

    if (fs.existsSync(frontendDir)) {
      fs.rmSync(frontendDir, { recursive: true, force: true });
      console.log(` Deleted frontend directory: ${frontendDir}`);
    } else {
      console.log(`  Frontend directory not found: ${frontendDir}`);
    }

    removeBaseApiTag(featureName);

    return true;
  } catch (error) {
    console.error(` Error deleting frontend feature:`, error);
    return false;
  }
}

function removeBaseApiTag(featureName: string): void {
  const baseApiPath = path.resolve(__dirname, "../../../frontend/src/store/api/baseApi.ts");
  
  if (!fs.existsSync(baseApiPath)) {
    return;
  }

  let content = fs.readFileSync(baseApiPath, "utf-8");
  const tagType = capitalizeFirst(featureName);

  content = content.replace(
    new RegExp(`[,\\s]*'${tagType}'[,\\s]*`, 'g'),
    (match) => match.includes(',') ? ', ' : ''
  );

  content = content.replace(/,\s*,/g, ',');
  content = content.replace(/\[\s*,/g, '[');
  content = content.replace(/,\s*\]/g, ']');

  fs.writeFileSync(baseApiPath, content, "utf-8");
  console.log(` Removed '${tagType}' tag from baseApi`);
}