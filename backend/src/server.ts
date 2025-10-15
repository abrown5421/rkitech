import express, { Request, Response } from 'express';
import figlet from "figlet";
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Rkitech Node server is running successfully');
});

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

startServer();
