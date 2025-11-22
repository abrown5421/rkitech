import type { FieldConfig, FormMode } from "../../../dynamicForm/dynamicFormTypes";
import type { ITheme } from "../../../theme/themeTypes";
import { ALL_COLOR_KEYS } from "./adminThemePageTypes";

export const generateThemeColorFields = (): FieldConfig[] => {
  return ALL_COLOR_KEYS.flatMap((key) => [
    {
      type: "row",
      name: `${key}-group`,
      label: `${key} Colors`,
      gap: 2,
      children: [
        {
          name: `${key}.main`,
          label: `${key.charAt(0).toUpperCase() + key.slice(1)} Main`,
          type: "color",
          required: true,
          helperText: `Main color for ${key}`,
          containerSx: { display: "flex", flex: 1 }
        },
        {
          name: `${key}.content`,
          label: `${key.charAt(0).toUpperCase() + key.slice(1)} Content`,
          type: "color",
          required: true,
          helperText: `Content color for ${key}`,
          containerSx: { display: "flex", flex: 1 }
        }
      ],
    }
  ]);
};

export const themeBaseFields: FieldConfig[] = [
  {
    name: "name",
    label: "Theme Name",
    type: "text",
    required: true,
    helperText: "Enter the theme's name"
  }
];

export const getThemeFormConfig = (mutations?: any) => {
  const colorFields = generateThemeColorFields();

  return {
    fields: [
      ...themeBaseFields,
      ...colorFields
    ],

    getInitialValues: (item?: ITheme) => {
      const initial: any = {
        _id: item?._id,
        name: item?.name || "",
        active: item?.active || false,
      };

      ALL_COLOR_KEYS.forEach((key) => {
        initial[key] = {
          main: item?.[key]?.main || "#000000",
          content: item?.[key]?.content || "#ffffff"
        };
      });

      console.log("Theme Initial Values:", initial);
      return initial;
    },

    validate: (values: Record<string, any>) => {
      const errors: Record<string, string> = {};

      if (!values.name?.trim()) {
        errors.name = "Theme Name is required";
      }

      ALL_COLOR_KEYS.forEach((key) => {
        if (!values[key]?.main?.trim()) {
          errors[`${key}.main`] = `${key} main color is required`;
        }
        if (!values[key]?.content?.trim()) {
          errors[`${key}.content`] = `${key} content color is required`;
        }
      });

      return Object.keys(errors).length ? errors : null;
    },

    onSubmit: async (
      values: any,
      mode: FormMode,
      item?: ITheme
    ) => {
      const { createTheme, updateTheme } = mutations || {};

      if (!createTheme || !updateTheme) {
        console.error("Mutations not provided to formConfig");
        return;
      }

      const themeData: Partial<ITheme> = {
        name: values.name,
        active: values.active,
        primary: values.primary,
        secondary: values.secondary,
        accent: values.accent,
        success: values.success,
        warning: values.warning,
        error: values.error,
        neutral: values.neutral,
        neutral2: values.neutral2,
        neutral3: values.neutral3
      };

      if (mode === 'create') {
        return await createTheme(themeData).unwrap();
      } else {
        return await updateTheme({ 
          id: item?._id || values._id, 
          data: themeData  
        }).unwrap();
      }
    }
  };
};