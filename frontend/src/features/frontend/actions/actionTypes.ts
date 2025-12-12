export type ActionParameterType =
  | "text"
  | "select"
  | "page-select"
  | "number"
  | "boolean";

export interface ActionConfigParameter {
  name: string;
  label: string;
  type: ActionParameterType;
  required: boolean;
  options?: { value: string; label: string }[];
}

export interface ActionConfig {
  type: string;
  label: string;
  description: string;
  parameters: ActionConfigParameter[];
}

export interface ActionHandler<P = any> {
  config: ActionConfig;
  execute: (params: P, hooks: any) => void | Promise<void>;
}

export interface ActionExecutionRequest<P = any> {
  type: string;
  params: P;
}

export interface NavigateParams {
  pageLinkId: string;
  animate?: boolean;
}

export interface OpenUrlParams {
  url: string;
  newTab?: boolean;
}
