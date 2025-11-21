import type { FormRegistryEntry } from "./dynamicFormTypes";

const registry: Record<string, FormRegistryEntry> = {};

export const registerForm = (
  formID: string,
  callbacks: FormRegistryEntry
) => {
  registry[formID] = callbacks;
};

export const getFormCallbacks = (formID?: string) => {
  if (!formID) return {};
  return registry[formID] || {};
};
