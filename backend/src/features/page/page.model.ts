import mongoose, { Schema, Document } from 'mongoose';
import { IPage } from './page.types';

const { v4: uuidv4 } = require('uuid');

const PageSchema: Schema = new Schema<IPage>({
  pageName: { type: String, required: true },
  pagePath: { type: String, required: true },
  pageRenderMethod: { type: String, default: 'static' },
  pageActive: { type: Boolean, default: true },
  pageColor: { type: String, default: 'white' },
  pageIntensity: { type: Boolean, default: false },
  pageEntranceAnimation: { type: String, default: 'animate__fadeIn' },
  pageExitAnimation: { type: String, default: 'animate__fadeOut' },
  pageID: { type: String, default: uuidv4() },
}, { timestamps: true });

export const Page = mongoose.model<IPage>('Page', PageSchema);
