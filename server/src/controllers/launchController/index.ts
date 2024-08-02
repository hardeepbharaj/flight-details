import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

import Launch from '../../models/launch';
import { SPACEX_API_URL, LAUNCH_OPTIONS } from './constants';

export const getLaunches = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { offset = 0, limit = 30 } = req.query;

    const response = await axios.post(SPACEX_API_URL, {
      options: {
        limit,
        offset,
        ...LAUNCH_OPTIONS
      }
    });

    const { docs, totalDocs } = response.data;

    const responseData = docs.length > 0
      ? { data: docs, total: totalDocs }
      : { data: [], total: 0 };

    res.json(responseData);
  } catch (error) {
    // have used a global error handler middleware errorHandler.ts
    next(error);
  }
};

export const saveLaunch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { flight_number, name, date_utc } = req.body;

    if (!flight_number || !name || !date_utc) {
      return res.status(400).json({ message: 'flight_number, name, and date_utc are required.' });
    }

    const existingLaunch = await Launch.findOne({ flight_number });

    if (existingLaunch) {
      return res.status(409).json({ message: 'Launch with this flight number already exists.' });
    }

    const launch = new Launch({ flight_number, name, date_utc });
    const response = await launch.save();
    res.status(201).json(response);
  } catch (error) {
    // have used a global error handler middleware errorHandler.ts
    next(error);
  }
};

export const getSavedLaunches = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const offset = parseInt(req.query.offset as string) || 0;
    const limit = parseInt(req.query.limit as string) || 30;

    // This is not optimized way to get count as we calculate the count on each request
    const total = await Launch.countDocuments();

    const launches = await Launch.find()
      .skip(offset)
      .limit(limit);

    res.json({ data: launches, total });
  } catch (error) {
    // have used a global error handler middleware errorHandler.ts
    next(error);
  }
};

export const deleteLaunch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const deletedLaunch = await Launch.findByIdAndDelete(id);

    if (!deletedLaunch) {
      return res.status(404).json({ message: 'Launch not found' });
    }

    res.status(204).end();
  } catch (error) {
    // have used a global error handler middleware errorHandler.ts
    next(error);
  }
};
