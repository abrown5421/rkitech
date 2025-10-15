import { app } from './app'; 
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import figlet from 'figlet';

dotenv.config();

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);

    console.clear();
    console.log(figlet.textSync("RKITECH", { font: "Big" }));
    console.log("Welcome to RKITECH!\n");
    console.log('MongoDB connection successful');

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}
