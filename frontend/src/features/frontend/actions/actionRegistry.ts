import type { ActionHandler } from "./actionTypes";

const actionRegistry: Record<string, ActionHandler<any>> = {};

export const registerAction = <P>(handler: ActionHandler<P>) => {
  actionRegistry[handler.config.type] = handler;
};

export const getAction = (type: string): ActionHandler<any> | undefined => {
  return actionRegistry[type];
};

export const getAllActions = () => {
  return Object.values(actionRegistry);
};

export default actionRegistry;
