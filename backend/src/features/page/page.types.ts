import { Document } from 'mongoose';

export interface IPage extends Document {
  pageName: string;
  pagePath: string;
  pageRenderMethod: 'static' | 'dynamic';
  pageActive: boolean;
  pageColor: string;
  pageIntensity: boolean;
  pageEntranceAnimation: string;
  pageExitAnimation: string;
}