import mongoose, { Schema } from 'mongoose';
import { IElements } from './elements.types';

const ElementsSchema: Schema = new Schema<IElements>({
  type: { type: String, required: true },
  data: { type: Schema.Types.Mixed, required: true, default: {} },
  styles: { type: Schema.Types.Mixed, required: false },
  sx: { type: Schema.Types.Mixed, required: false },
  className: { type: String, required: false },
  props: { type: Schema.Types.Mixed, required: false },
  children: [{ type: String, required: false }],
  parentId: { type: String, required: false },
  order: { type: Number, required: false, default: 0 },
}, { timestamps: true });

ElementsSchema.index({ parentId: 1, order: 1 });

export const Elements = mongoose.model<IElements>('Elements', ElementsSchema);