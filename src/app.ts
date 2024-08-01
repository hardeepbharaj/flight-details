import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';

import launchesRouter from './routes/launches';
import { errorHandler } from './middlewares/errorHandler';
import connectDB from './config/db';

const app: Application = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api', launchesRouter);

app.use(errorHandler);

connectDB();

export default app;
