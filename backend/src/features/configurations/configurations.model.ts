import mongoose, { Schema } from "mongoose";
import { IConfiguration } from "./configurations.types";

const ConfigSchema: Schema<IConfiguration> = new Schema<IConfiguration>({
  key: { type: String, required: true, unique: true },
  data: { type: Schema.Types.Mixed, required: true },
}, { timestamps: true });

export const Config = mongoose.model<IConfiguration>("Config", ConfigSchema);
