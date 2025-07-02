export interface ActiveEditingNodeState {
  nodeUUID: string | null;
  nodeType: string | null;
  nodeProps: Record<string, any> | null;
}