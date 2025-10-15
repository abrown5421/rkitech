import express, { NextFunction, Request, Response } from 'express';
import figlet from "figlet";
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import pageRoutes from './features/page/page.routes';
import { BaseError } from './features/base/BaseError';

//configs
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

//root route
app.get('/', (res: Response) => {
  res.send('Rkitech Node server is running successfully');
});

//request log middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now()
  console.log(`New ${req.method} request sent to ${req.url}`)
  
  res.on('finish', () => {
    const secElapsed = Date.now() - start
    console.log(`${req.method} request processed in ${secElapsed}s`)  
  })

  next()
})

//feature routes
app.use('/api/pages', pageRoutes);

//server entry
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

//error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const status = err instanceof BaseError ? err.status : 500;

  console.error(`${req.method} ${req.url} failed`);
  console.error(err.stack);

  res.status(status).json({
    error: {
      message: err.message || "Internal Server Error",
      status,
      details: err.details || null,
    },
  });

  const msElapsed = Date.now() - start;
  console.log(`${req.method} ${req.url} failed after ${msElapsed}ms`);
});