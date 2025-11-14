import mongoose, { Schema } from 'mongoose';
import { IPage } from './page.types';

const PageSchema: Schema = new Schema<IPage>({
  pageName: { type: String, required: true },
  pagePath: { type: String, required: true },
  pageRenderMethod: { type: String, default: 'static' },
  pageContent: [{ type: String }],
  pageFontFamily: { type: String, default: 'SecondaryFont' },
  pageFontColor: { type: String, default: 'neutral.content' },
  pageActive: { type: Boolean, default: true },
  pageColor: { type: String, default: 'white' },
  pageEntranceAnimation: { type: String, default: 'animate__fadeIn' },
  pageExitAnimation: { type: String, default: 'animate__fadeOut' },
}, { timestamps: true });

export const Page = mongoose.model<IPage>('Page', PageSchema);
