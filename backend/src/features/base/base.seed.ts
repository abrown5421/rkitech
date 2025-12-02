import mongoose, { Model, Document } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export interface SeedConfig<T> {
  modelName: string;
  model: Model<T>;
  data: Partial<T>[];
  uniqueField: keyof T;
  displayField: keyof T;
}

export const seedDatabase = async <T extends Document>(
  config: SeedConfig<T>
): Promise<void> => {
  const MONGO_URI = process.env.MONGO_URI!;

  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    for (const itemData of config.data) {
      const uniqueValue = itemData[config.uniqueField as keyof typeof itemData];
      const exists = await config.model.findOne({
        [config.uniqueField]: uniqueValue,
      } as any);

      if (!exists) {
        await config.model.create(itemData as any);
        const displayValue = itemData[config.displayField as keyof typeof itemData];
        console.log(`Inserted ${config.modelName}: ${displayValue}`);
      }
    }

    console.log(` Default ${config.modelName}s initialized`);
    await mongoose.disconnect();
  } catch (err) {
    console.error(`Error seeding ${config.modelName}s:`, err);
    process.exit(1);
  }
};