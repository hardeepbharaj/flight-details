import express, { Application } from 'express';
import dotenv from 'dotenv';

import { getLaunches, saveLaunch, getSavedLaunches, deleteLaunch } from '../index';
import Launch from '../../../models/launch';
import { errorHandler } from '../../../middlewares/errorHandler';

dotenv.config();

jest.mock('../../../models/launch');

const MockedLaunch = Launch as jest.Mocked<typeof Launch>;

// Set up the Express application
const app: Application = express();
const testRoute = process.env.LAUNCH_TEST_ROUTE;

app.use(express.json());

if (testRoute === 'getLaunches') {
  app.get('/launches', getLaunches);
}

if (testRoute === 'saveLaunch') {
  app.post('/launches', saveLaunch);
}

if (testRoute === 'getSavedLaunches') {
  app.get('/saved-launches', getSavedLaunches);
}

if (testRoute === 'deleteLaunch') {
  app.delete('/launches/:id', deleteLaunch);
}

app.use(errorHandler);

export { app, MockedLaunch };
