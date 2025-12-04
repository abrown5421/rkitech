import mongoose, { Model, Document } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const globalKeyToIdMap = new Map<string, string>();
let isConnected = false;

export interface SeedConfig<T> {
  modelName: string;
  model: Model<T>;
  data: Partial<T>[];
  uniqueField: keyof T;
  displayField: keyof T;
}

export interface SeedConfigWithRelations<T> extends SeedConfig<T> {
  dataWithKeys?: Array<Partial<T> & { 
    _seedKey?: string;
    _relationFields?: Record<string, string | string[]>;
  }>;
}

export const seedDatabase = async <T extends Document>(
  config: SeedConfig<T> | SeedConfigWithRelations<T>
): Promise<Map<string, string>> => {
  const MONGO_URI = process.env.MONGO_URI!;

  try {
    if (!isConnected) {
      await mongoose.connect(MONGO_URI);
      console.log('Connected to MongoDB');
      isConnected = true;
    }

    const hasRelations = 'dataWithKeys' in config && config.dataWithKeys;
    
    let localMap: Map<string, string>;
    if (hasRelations) {
      localMap = await seedWithRelations(config as SeedConfigWithRelations<T>);
    } else {
      localMap = await seedSimple(config);
    }

    localMap.forEach((value, key) => {
      globalKeyToIdMap.set(key, value);
    });

    console.log(`Default ${config.modelName}s initialized`);
    
    return localMap;
  } catch (err) {
    console.error(`Error seeding ${config.modelName}s:`, err);
    process.exit(1);
  }
};

async function seedSimple<T extends Document>(config: SeedConfig<T>): Promise<Map<string, string>> {
  const keyToIdMap = new Map<string, string>();
  
  for (const itemData of config.data) {
    const uniqueValue = itemData[config.uniqueField as keyof typeof itemData];
    const exists = await config.model.findOne({
      [config.uniqueField]: uniqueValue,
    } as any);

    if (!exists) {
      const created = await config.model.create(itemData as any);
      const displayValue = itemData[config.displayField as keyof typeof itemData];
      console.log(`Inserted ${config.modelName}: ${displayValue}`);
    }
  }
  
  return keyToIdMap;
}

async function seedWithRelations<T extends Document>(
  config: SeedConfigWithRelations<T>
): Promise<Map<string, string>> {
  const keyToIdMap = new Map<string, string>();

  for (const itemData of config.dataWithKeys!) {
    const { _seedKey, _relationFields, ...cleanData } = itemData;
    
    const uniqueValue = cleanData[config.uniqueField as keyof typeof cleanData];
    const exists = await config.model.findOne({
      [config.uniqueField]: uniqueValue,
    } as any);

    if (!exists) {
      const created = await config.model.create(cleanData as any);
      if (_seedKey) {
        keyToIdMap.set(_seedKey, (created as any)._id.toString());
        globalKeyToIdMap.set(_seedKey, (created as any)._id.toString());
      }
      const displayValue = cleanData[config.displayField as keyof typeof cleanData];
      console.log(`Inserted ${config.modelName}: ${displayValue}`);
    } else if (_seedKey) {
      keyToIdMap.set(_seedKey, (exists as any)._id.toString());
      globalKeyToIdMap.set(_seedKey, (exists as any)._id.toString());
    }
  }

  for (const itemData of config.dataWithKeys!) {
    if (itemData._relationFields && itemData._seedKey) {
      const docId = keyToIdMap.get(itemData._seedKey);
      const updates: any = {};

      for (const [fieldName, refKeys] of Object.entries(itemData._relationFields)) {
        if (Array.isArray(refKeys)) {
          updates[fieldName] = refKeys.map(k => 
            keyToIdMap.get(k) || globalKeyToIdMap.get(k)
          ).filter(Boolean);
        } else {
          updates[fieldName] = keyToIdMap.get(refKeys) || globalKeyToIdMap.get(refKeys);
        }
      }

      if (docId && Object.keys(updates).length > 0) {
        await config.model.findByIdAndUpdate(docId, updates);
        console.log(`Updated relations for ${config.modelName}: ${itemData._seedKey}`);
      }
    }
  }
  
  return keyToIdMap;
}

export const getGlobalSeedMap = (): Map<string, string> => globalKeyToIdMap;

export const disconnectDatabase = async (): Promise<void> => {
  if (isConnected) {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    isConnected = false;
  }
};