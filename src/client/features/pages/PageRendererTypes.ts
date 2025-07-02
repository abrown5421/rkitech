import type { JSONNode } from "../../../store/globalSlices/initialApp/initialAppTypes";

export interface PageRendererProps {
  node: JSONNode;
  editing?: boolean;
  onComponentClick?: (uuid: string, type: string, props: Record<string, any>) => void; 
}