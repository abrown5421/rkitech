export const modalCallbackRegistry = {
  onConfirm: {} as Record<string, () => void>,
  onDeny: {} as Record<string, () => void>,
};