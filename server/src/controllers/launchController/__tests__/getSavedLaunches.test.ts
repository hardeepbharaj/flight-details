process.env.LAUNCH_TEST_ROUTE = 'getSavedLaunches';

import request from 'supertest';
import mongoose from 'mongoose';

import { app } from './testSetup';
import Launch from '../../../models/launch';

jest.mock('../../../models/launch', () => {
  return {
    Launch: {
      countDocuments: jest.fn(),
      find: jest.fn(),
    },
  };
});

describe('GET /launches/saved', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/test');
  });

  afterAll(async () => {
    delete process.env.LAUNCH_TEST_ROUTE;
    await mongoose.connection.close();
  });

  it('should return a list of launches with total count', async () => {
    (Launch as any).countDocuments = jest.fn().mockResolvedValue(100);
    (Launch as any).find = jest.fn().mockReturnValue({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([{ id: 1, name: 'Launch 1' }, { id: 2, name: 'Launch 2' }])
    });

    const response = await request(app).get('/saved-launches?offset=0&limit=2');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: [{ id: 1, name: 'Launch 1' }, { id: 2, name: 'Launch 2' }],
      total: 100,
    });

    expect(Launch.countDocuments).toHaveBeenCalled();
    expect(Launch.find).toHaveBeenCalled();
  });

  it('should handle errors and pass them to the next middleware', async () => {
    jest.spyOn(Launch, 'countDocuments').mockRejectedValue(new Error('Database error'));
    jest.spyOn(Launch, 'find').mockRejectedValue(new Error('Database error'));
    
    const response = await request(app).get('/saved-launches?offset=0&limit=2');

    expect(response.status).toBe(500);

    expect(response.body.message).toBe('Database error');
  });
});
