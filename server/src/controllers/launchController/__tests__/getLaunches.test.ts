process.env.LAUNCH_TEST_ROUTE = 'getLaunches';

import request from 'supertest';
import axios from 'axios';

import { app } from './testSetup';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('GET /launches', () => {
  afterAll(() => {
    delete process.env.LAUNCH_TEST_ROUTE;
  });

  it('should fetch launches and return them with a total count', async () => {
    const launches = [
      { flight_number: 1, name: 'Falcon 1', date_utc: '2006-03-24T22:30:00Z' }
    ];
    
    mockedAxios.post.mockResolvedValue({
      data: {
        docs: launches,
        totalDocs: launches.length
      }
    });

    const response = await request(app).get('/launches');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('total');
    expect(response.body.data).toHaveLength(launches.length);
    expect(response.body.total).toBe(launches.length);
  });

  it('should return an empty array when no data is fetched', async () => {
    mockedAxios.post.mockResolvedValue({
      data: {
        docs: [],
        totalDocs: 0
      }
    });

    const response = await request(app).get('/launches');

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual([]);
    expect(response.body.total).toBe(0);
  });

  it('should handle errors gracefully', async () => {
    mockedAxios.post.mockRejectedValue(new Error('Failed to fetch SpaceX launches'));

    const response = await request(app).get('/launches');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Failed to fetch SpaceX launches' });
  });
});
