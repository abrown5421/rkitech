import mongoose, { Types } from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_PATH = path.join(__dirname, "../../src/data");

const COLLECTION_FILES = {
  elements: "rkitech.elements.json",
  pages: "rkitech.pages.json",
  themes: "rkitech.themes.json",
  users: "rkitech.users.json",
};

function convertIds(doc: any): any {
  if (Array.isArray(doc)) {
    return doc.map(convertIds);
  } else if (doc && typeof doc === "object") {
    const newDoc: any = {};

    for (const key in doc) {
      const value = doc[key];

      if (key === "_id" && value?.$oid) {
        newDoc[key] = new Types.ObjectId(value.$oid);
      } else if (key === "children" && Array.isArray(value)) {
        newDoc[key] = value.map((c: any) => {
          if (c?.$oid) return new Types.ObjectId(c.$oid);
          if (typeof c === "string" && /^[a-f0-9]{24}$/.test(c)) return new Types.ObjectId(c);
          return c; 
        });
      } else if (key === "parentId" && value) {
        if (value?.$oid) newDoc[key] = new Types.ObjectId(value.$oid);
        else if (typeof value === "string" && /^[a-f0-9]{24}$/.test(value)) newDoc[key] = new Types.ObjectId(value);
        else newDoc[key] = null;
      } else {
        newDoc[key] = convertIds(value);
      }
    }

    return newDoc;
  }

  return doc;
}

export default async function seedDatabase() {
  console.log("Seeding database...");

  try {
    await mongoose.connect("mongodb://localhost:27017/rkitech");
    const db = mongoose.connection;

    for (const [collectionName, fileName] of Object.entries(COLLECTION_FILES)) {
      const filePath = path.join(DATA_PATH, fileName);
      const rawData = fs.readFileSync(filePath, "utf-8");
      let documents = JSON.parse(rawData);

      if (!Array.isArray(documents)) {
        console.warn(`Skipping ${fileName}, not an array.`);
        continue;
      }

      documents = convertIds(documents);

      const collection = db.collection(collectionName);
      await collection.deleteMany({});
      await collection.insertMany(documents);

      console.log(`✅ Inserted ${documents.length} into '${collectionName}'`);
    }

    const elementsCollection = db.collection("elements");

    const allElements = await elementsCollection.find({}).toArray();

    const updates: any[] = [];

    for (const parent of allElements) {
      if (!Array.isArray(parent.children)) continue;

      for (const childId of parent.children) {
        updates.push({
          updateOne: {
            filter: { _id: childId },
            update: { $set: { parentId: parent._id } },
          },
        });
      }
    }

    if (updates.length > 0) {
      await elementsCollection.bulkWrite(updates);
      console.log(`🔗 Linked ${updates.length} child → parent relationships`);
    }

    console.log("🎉 Database seeded successfully!");
  } catch (err) {
    console.error("❌ Error seeding database:", err);
  } finally {
    await mongoose.disconnect();
  }
}
