process.env.LAUNCH_TEST_ROUTE = 'deleteLaunch';

import request from 'supertest';

import { app, MockedLaunch } from './testSetup';

describe('DELETE /launches/:id', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    delete process.env.LAUNCH_TEST_ROUTE;
  });

  it('should delete a launch and return status 204', async () => {
    const launchId = '605c72efb3f2b3422c23a456';

    MockedLaunch.findByIdAndDelete.mockResolvedValue({ flight_number: 1, name: 'Falcon 1', date_utc: '2006-03-24T22:30:00Z' });

    const response = await request(app).delete(`/launches/${launchId}`);

    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });

  it('should return 404 if the launch to delete does not exist', async () => {
    const launchId = '605c72efb3f2b3422c23a456';

    MockedLaunch.findByIdAndDelete.mockResolvedValue(null);

    const response = await request(app).delete(`/launches/${launchId}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Launch not found');
  });

  it('should handle errors and return 500', async () => {
    const launchId = '605c72efb3f2b3422c23a456';

    MockedLaunch.findByIdAndDelete.mockRejectedValue(new Error('Database error'));

    const response = await request(app).delete(`/launches/${launchId}`);

    expect(response.status).toBe(500);

    expect(response.body).toHaveProperty('message', 'Database error');
  });
});
