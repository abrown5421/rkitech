import { registerAction } from "./actionRegistry";
import type { ActionHandler, NavigateParams, OpenUrlParams } from "./actionTypes";

export const navigateAction: ActionHandler<NavigateParams> = {
  config: {
    type: "navigate",
    label: "Navigate to Page",
    description: "Navigate to another page in the application",
    parameters: [
      { name: "pageLinkId", label: "Target Page", type: "page-select", required: true },
      { name: "animate", label: "Animate Transition", type: "boolean", required: false }
    ]
  },

  execute: (params, hooks) => {
    hooks.navigateToPage(params.pageLinkId, params.animate ?? true);
  }
};

export const openUrlAction: ActionHandler<OpenUrlParams> = {
  config: {
    type: "handleOpenUrl",
    label: "Open URL",
    description: "Open an external URL",
    parameters: [
      { name: "url", label: "URL", type: "text", required: true },
      { name: "newTab", label: "Open in New Tab", type: "boolean", required: false }
    ]
  },

  execute: (params) => {
    if (params.newTab ?? true) {
      window.open(params.url, "_blank");
    } else {
      window.location.href = params.url;
    }
  }
};

registerAction(navigateAction);
registerAction(openUrlAction);
