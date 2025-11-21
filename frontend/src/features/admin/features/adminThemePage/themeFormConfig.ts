import type { FieldConfig } from "../../../dynamicForm/dynamicFormTypes";

export const themeFormFields: FieldConfig[] = [
  {
    name: "name",
    label: "Theme Name",
    type: "text",
    required: true,
    helperText: "Enter a readable name for this theme (e.g. Ocean Blue, Dark Mode).",
  },
  {
    name: "active",
    label: "Set As Active Theme",
    type: "switch",
    defaultValue: false,
    helperText: "Only one theme can be active at a time.",
  },

  {
    name: "primary",
    label: "Primary Color",
    type: "color",
    required: true,
    helperText: "Used for primary buttons, main highlights, and brand accents."
  },

  {
    name: "secondary",
    label: "Secondary Color",
    type: "color",
    required: true,
    helperText: "Used for secondary UI elements and alternative button states."
  },

  {
    name: "accent",
    label: "Accent Color",
    type: "color",
    required: true,
    helperText: "Used for subtle highlights, accents, badges, and micro-interactions."
  },

  {
    name: "success",
    label: "Success Color",
    type: "color",
    required: true,
    helperText: "Used for success messages, completion states, and positive feedback.",
  },

  {
    name: "warning",
    label: "Warning Color",
    type: "color",
    required: true,
    helperText: "Used for warning banners and non-critical alerts.",
  },

  {
    name: "error",
    label: "Error Color",
    type: "color",
    required: true,
    helperText: "Used for error messages, invalid inputs, and destructive actions.",
  },

  {
    name: "neutral",
    label: "Neutral Base",
    type: "color",
    required: true,
    helperText: "Primary background + surface color for the UI.",
  },
  {
    name: "neutral2",
    label: "Neutral Secondary",
    type: "color",
    required: true,
    helperText: "Secondary backgrounds such as cards and containers.",
  },
  {
    name: "neutral3",
    label: "Neutral Tertiary",
    type: "color",
    required: true,
    helperText: "Borders, outlines, subtle backgrounds.",
  },
];
