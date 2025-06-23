import type { JSONNode } from "../../../store/globalSlices/initialApp/initialAppTypes";

export interface CollectionLooperProps {
  collectionName: string;
  itemRendererNode: JSONNode;
  filter?: { field: string; value: any };
}