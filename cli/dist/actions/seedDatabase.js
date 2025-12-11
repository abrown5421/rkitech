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
function convertIds(doc) {
    if (Array.isArray(doc)) {
        return doc.map(convertIds);
    }
    else if (doc && typeof doc === "object") {
        const newDoc = {};
        for (const key in doc) {
            if (key === "_id" && doc[key]?.$oid) {
                newDoc[key] = new Types.ObjectId(doc[key].$oid);
            }
            else {
                newDoc[key] = convertIds(doc[key]);
            }
        }
        return newDoc;
    }
    else {
        return doc;
    }
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
                console.warn(`Skipping ${fileName}, not an array of documents.`);
                continue;
            }
            documents = convertIds(documents);
            const collection = db.collection(collectionName);
            await collection.deleteMany({});
            await collection.insertMany(documents);
            console.log(`✅ Inserted ${documents.length} documents into '${collectionName}'`);
        }
        console.log("🎉 Database seeded successfully!");
    }
    catch (err) {
        console.error("❌ Error seeding database:", err);
    }
    finally {
        await mongoose.disconnect();
    }
}
