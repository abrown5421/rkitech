import mongoose, { Schema } from 'mongoose';
import { IPage } from './page.types';

const PageSchema: Schema = new Schema<IPage>({
  pageUniqueId: { type: String, required: true },
  pageName: { type: String, required: true },
  pagePath: { type: String, required: true },
  pageRenderMethod: { type: String, enum: ['static', 'dynamic'], default: 'static' },
  rootElement: { type: String, required: false },
  pageActive: { type: Boolean, default: true },
  pageColor: { type: String, default: 'white' },
  pageEntranceAnimation: { type: String, default: 'animate__fadeIn' },
  pageExitAnimation: { type: String, default: 'animate__fadeOut' },
}, { timestamps: true });

export const Page = mongoose.model<IPage>('Page', PageSchema);
