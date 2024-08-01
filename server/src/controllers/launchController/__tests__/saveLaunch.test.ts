process.env.LAUNCH_TEST_ROUTE = 'saveLaunch';

import request from 'supertest';

import { app, MockedLaunch } from './testSetup';

describe('POST /launches', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    delete process.env.LAUNCH_TEST_ROUTE;
  });

  it('should save a new launch and return it', async () => {
    const launchData = { flight_number: 1, name: 'Falcon 1', date_utc: '2006-03-24T22:30:00Z' };

    MockedLaunch.findOne.mockResolvedValue(null);

    MockedLaunch.prototype.save.mockResolvedValue(launchData);

    const response = await request(app).post('/launches').send(launchData);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(launchData);
  });

  it('should return 400 if flight_number is missing', async () => {
    const missingFlightNumber = { name: 'Falcon 1', date_utc: '2006-03-24T22:30:00Z' };

    const response = await request(app).post('/launches').send(missingFlightNumber);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'flight_number, name, and date_utc are required.' });
  });

  it('should return 400 if name is missing', async () => {
    const missingName = { flight_number: 1, date_utc: '2006-03-24T22:30:00Z' };

    const response = await request(app).post('/launches').send(missingName);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'flight_number, name, and date_utc are required.' });
  });

  it('should return 400 if date_utc is missing', async () => {
    const missingDateUtc = { flight_number: 1, name: 'Falcon 1' };

    const response = await request(app).post('/launches').send(missingDateUtc);
    
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'flight_number, name, and date_utc are required.' });
  });

  it('should return 409 if launch with the same flight number already exists', async () => {
    const launchData = { flight_number: 1, name: 'Falcon 1', date_utc: '2006-03-24T22:30:00Z' };

    MockedLaunch.findOne.mockResolvedValue(launchData);

    const response = await request(app).post('/launches').send(launchData);

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ message: 'Launch with this flight number already exists.' });
  });

  it('should handle errors and return 500', async () => {
    const launchData = { flight_number: 1, name: 'Falcon 1', date_utc: '2006-03-24T22:30:00Z' };

    MockedLaunch.findOne.mockRejectedValue(new Error('Database error'));
    MockedLaunch.prototype.save.mockRejectedValue(new Error('Database error'));

    const response = await request(app).post('/launches').send(launchData);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message', 'Database error');
  });
});
