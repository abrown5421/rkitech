import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Page } from './page.model';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI!;

const defaultPages = [
  {
    pageName: "Home",
    pagePath: "/",
    pageRenderMethod: "static",
    pageActive: true,
    pageColor: "white",
    pageIntensity: false,
    pageEntranceAnimation: "animate__fadeIn",
    pageExitAnimation: "animate__fadeOut",
    pageID: "534db1ae-8e49-45af-a505-2ef5c02c478b"
  },
  {
    pageName: "PageNotFound",
    pagePath: "/page-not-found",
    pageRenderMethod: "static",
    pageActive: true,
    pageColor: "white",
    pageIntensity: false,
    pageEntranceAnimation: "animate__fadeIn",
    pageExitAnimation: "animate__fadeOut",
    pageID: "58f820e6-e10b-4dbe-a11d-5f2055b75c0c"
  },
  {
    pageName: "PrivacyPolicy",
    pagePath: "/privacy-policy",
    pageRenderMethod: "static",
    pageActive: true,
    pageColor: "white",
    pageIntensity: false,
    pageEntranceAnimation: "animate__fadeIn",
    pageExitAnimation: "animate__fadeOut",
    pageID: "7f2a04a6-b8c2-4cfd-b6e4-cf325b03e0e6"
  }
];

const seedPages = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    for (const pageData of defaultPages) {
      const exists = await Page.findOne({ pagePath: pageData.pagePath });
      if (!exists) {
        await Page.create(pageData);
        console.log(`Inserted page: ${pageData.pageName}`);
      }
    }

    console.log('✅ Default pages initialized');
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error seeding pages:', err);
  }
};

seedPages();
