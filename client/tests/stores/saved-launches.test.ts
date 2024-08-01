import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import axios, { AxiosError } from 'axios';

import { useSavedLaunchesStore } from '@/stores/savedLaunches';
import { useToastStore } from '@/stores/toast';
import type { LaunchType } from '@/types/launch';

const { public: { apiUrl: API_URL } } = useRuntimeConfig();

vi.mock('axios');
vi.mock('#app', () => ({
  useRuntimeConfig: () => ({
    public: { apiUrl: API_URL },
  }),
}));

describe('useSavedLaunchesStore', () => {
  let savedLaunchesStore: ReturnType<typeof useSavedLaunchesStore>;
  let toastStore: ReturnType<typeof useToastStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    savedLaunchesStore = useSavedLaunchesStore();
    toastStore = useToastStore();
  });

  it('fetches saved launches successfully', async () => {
    const mockLaunches: LaunchType[] = [
      { _id: '1', flight_number: 1, name: 'Launch 1', date_utc: '2024-01-01T00:00:00Z' },
      { _id: '2', flight_number: 2, name: 'Launch 2', date_utc: '2024-01-02T00:00:00Z' }
    ];

    const mockResponse = {
      data: mockLaunches,
      total: mockLaunches.length
    };

    vi.mocked(axios.get).mockResolvedValueOnce({ data: mockResponse, total: mockLaunches.length });

    await savedLaunchesStore.fetchSavedLaunches();

    expect(savedLaunchesStore.savedLaunches).toEqual(mockResponse.data);
    expect(savedLaunchesStore.totalLaunches).toBe(mockResponse.total);
  });

  it('handles fetch saved launches error', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.mocked(axios.get).mockRejectedValueOnce(new Error('Fetch error'));

    await savedLaunchesStore.fetchSavedLaunches();

    expect(savedLaunchesStore.savedLaunches).toEqual([]);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching launches:', expect.any(Error));
  });

  it('deletes a launch successfully', async () => {
    const mockLaunch = { _id: '1', flight_number: 1, name: 'Launch 1', date_utc: '2024-01-01T00:00:00Z' };
    savedLaunchesStore.savedLaunches = [mockLaunch];

    vi.mocked(axios.delete).mockResolvedValueOnce({ status: 204 });

    const addToastSpy = vi.spyOn(toastStore, 'addToast');

    await savedLaunchesStore.deleteLaunch(mockLaunch);

    expect(savedLaunchesStore.savedLaunches).toEqual([]);
    expect(addToastSpy).toHaveBeenCalledWith(`Flight-${mockLaunch.flight_number} deleted successfully!`, 'success');
  });

  it('handles delete launch error with AxiosError', async () => {
    const mockLaunch = { _id: '2', flight_number: 2, name: 'Launch 2', date_utc: '2024-02-01T00:00:00Z' };
    const mockError = new AxiosError('Delete error', 'ERR_BAD_REQUEST', {}, {}, {
      status: 400,
      data: { message: 'Bad request' },
    });

    vi.mocked(axios.delete).mockRejectedValueOnce(mockError);

    const addToastSpy = vi.spyOn(toastStore, 'addToast');

    await savedLaunchesStore.deleteLaunch(mockLaunch);

    expect(addToastSpy).toHaveBeenCalledWith('Error deleting launch: undefined', 'error');
  });

  it('handles delete launch error with generic error', async () => {
    const mockLaunch = { _id: '3', flight_number: 3, name: 'Launch 3', date_utc: '2024-03-01T00:00:00Z' };

    vi.mocked(axios.delete).mockRejectedValueOnce(new Error('Generic error'));

    const addToastSpy = vi.spyOn(toastStore, 'addToast');

    await savedLaunchesStore.deleteLaunch(mockLaunch);

    expect(addToastSpy).toHaveBeenCalledWith('Error deleting launch:', 'error');
  });
});

