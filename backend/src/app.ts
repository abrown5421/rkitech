import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import pageRoutes from './features/page/page.routes';
import { BaseError } from './features/base/BaseError';

export const app = express();

app.use(cors());
app.use(express.json());

// root
app.get('/', (res: Response) => {
  res.send('Rkitech Node server is running successfully');
});

// logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  console.log(`New ${req.method} request sent to ${req.url}`);
  res.on('finish', () => {
    console.log(`${req.method} request processed in ${Date.now() - start}ms`);
  });
  next();
});

// feature routes
app.use('/api/pages', pageRoutes);

// error middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err instanceof BaseError ? err.status : 500;
  console.error(err.stack);

  res.status(status).json({
    error: {
      message: err.message || 'Internal Server Error',
      status,
      details: err.details || null,
    },
  });
});
