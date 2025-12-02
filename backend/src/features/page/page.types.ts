import { Document } from 'mongoose';

export interface IPage extends Document {
  pageUniqueId: string;
  pageName: string;
  pagePath: string;
  pageRenderMethod: 'static' | 'dynamic';
  rootElement?: string;
  pageActive: boolean;
  pageColor: string;
  pageEntranceAnimation: string;
  pageExitAnimation: string;
}