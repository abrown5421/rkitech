import mongoose, { Schema } from 'mongoose';
import { IElements } from './elements.types';

const ElementsSchema: Schema = new Schema<IElements>({
  name: { type: String, required: false, default: "" },
  component: { type: String, required: true },
  props: { type: Schema.Types.Mixed, required: true },
  childText: { type: String, required: false },
  styles: { type: Schema.Types.Mixed, required: false },
  sx: { type: Schema.Types.Mixed, required: false },
  className: { type: String, required: false },
  droppable: { type: Boolean, required: true, default: false },
  children: [{ type: Schema.Types.Mixed, ref: "Elements", required: false }],
  parentId: { type: Schema.Types.ObjectId, ref: "Elements", required: false, default: null }
}, { timestamps: true });

ElementsSchema.index({ name: 1 });

export const Elements = mongoose.model<IElements>('Elements', ElementsSchema);
