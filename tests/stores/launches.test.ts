import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import axios, { AxiosError } from 'axios';

import { useLaunchesStore } from '@/stores/launches';
import { useToastStore } from '@/stores/toast';

const { public: { apiUrl: API_URL } } = useRuntimeConfig();

vi.mock('axios');
vi.mock('#app', () => ({
  useRuntimeConfig: () => ({
    public: { apiUrl: API_URL },
  }),
}));

describe('useLaunchesStore', () => {
  let launchesStore: ReturnType<typeof useLaunchesStore>;
  let toastStore: ReturnType<typeof useToastStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    launchesStore = useLaunchesStore();
    toastStore = useToastStore();
  });

  it('fetches launches successfully', async () => {
    const mockLaunches = [
      { flight_number: 1, name: 'Launch 1', date_utc: '2024-01-01T00:00:00Z' },
      { flight_number: 2, name: 'Launch 2', date_utc: '2024-01-02T00:00:00Z' },
    ];

    vi.mocked(axios.get).mockResolvedValueOnce({ data: { data: mockLaunches } });

    await launchesStore.fetchLaunches();

    expect(launchesStore.launches).toEqual(mockLaunches);
    expect(launchesStore.loading).toBe(false);
  });

  it('handles fetch launches error', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.mocked(axios.get).mockRejectedValueOnce(new Error('Fetch error'));

    await launchesStore.fetchLaunches();

    expect(launchesStore.launches).toEqual([]);
    expect(launchesStore.loading).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching launches:', expect.any(Error));
  });

  it('saves a launch successfully', async () => {
    const mockLaunch = { flight_number: 3, name: 'Launch 3', date_utc: '2024-01-03T00:00:00Z' };

    vi.mocked(axios.post).mockResolvedValueOnce({ status: 201 });

    const addToastSpy = vi.spyOn(toastStore, 'addToast');

    await launchesStore.saveLaunch(mockLaunch);

    expect(addToastSpy).toHaveBeenCalledWith(`Flight-${mockLaunch.flight_number} saved successfully!`, 'success');
  });

  it('handles save launch error with AxiosError', async () => {
    const mockLaunch = { flight_number: 4, name: 'Launch 4', date_utc: '2024-01-04T00:00:00Z' };
    const mockError = new AxiosError('Save error', 'ERR_BAD_REQUEST', {}, {}, {
      status: 400,
      data: { message: 'Bad request' },
    });

    vi.mocked(axios.post).mockRejectedValueOnce(mockError);

    const addToastSpy = vi.spyOn(toastStore, 'addToast');

    await launchesStore.saveLaunch(mockLaunch);

    expect(addToastSpy).toHaveBeenCalledWith('Error saving launch: undefined', 'error');
  });

  it('handles save launch error with generic error', async () => {
    const mockLaunch = { flight_number: 5, name: 'Launch 5', date_utc: '2024-01-05T00:00:00Z' };

    vi.mocked(axios.post).mockRejectedValueOnce(new Error('Generic error'));

    const addToastSpy = vi.spyOn(toastStore, 'addToast');

    await launchesStore.saveLaunch(mockLaunch);

    expect(addToastSpy).toHaveBeenCalledWith('Error saving launch.', 'error');
  });
});
