import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import pageRoutes from './features/page/page.routes';
import userRoutes from './features/user/user.routes';
import employeeRoutes from './features/employee/employee.routes';
import configurationsRoutes from './features/configurations/configurations.routes';
import { BaseError } from './middleware/error.middleware';
import mongoose from 'mongoose';

export const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', async (req: Request, res: Response) => {
  const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  const isHealthy = mongoStatus === 'connected';

  res.status(isHealthy ? 200 : 503).json({
    success: isHealthy,
    message: isHealthy
      ? 'Server and database are healthy'
      : 'Server running but database not connected',
    mongoStatus,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});


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
// [CLI_IMPORTS]
app.use('/api/configurations', configurationsRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/employees', employeeRoutes);
// [CLI_ROUTES]

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
