import mongoose, { Schema } from 'mongoose';
import { ITheme } from './theme.types';

const ColorSchema: Schema = new Schema({
  main: { type: String, required: true },
  content: { type: String, required: true },
});

const ThemeSchema: Schema = new Schema<ITheme>(
  {
    name: { type: String, required: true },
    active: { type: Boolean, default: true },
    primary: { type: ColorSchema, required: true },
    secondary: { type: ColorSchema, required: true },
    accent: { type: ColorSchema, required: true },
    success: { type: ColorSchema, required: true },
    warning: { type: ColorSchema, required: true },
    error: { type: ColorSchema, required: true },
    neutral: { type: ColorSchema, required: true },
    neutral2: { type: ColorSchema, required: true },
    neutral3: { type: ColorSchema, required: true },
  },
  { timestamps: true }
);

export const Theme = mongoose.model<ITheme>('Theme', ThemeSchema);
