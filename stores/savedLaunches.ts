import { defineStore } from 'pinia';
import axios, { AxiosError } from 'axios';

import { useToastStore } from '@/stores/toast';
import type { LaunchType, LaunchResponseType } from '@/types/launch';

export const useSavedLaunchesStore = defineStore('savedLaunches', () => {
  const toastStore = useToastStore();
  const { public: { apiUrl: API_URL } } = useRuntimeConfig();
  const savedLaunches = ref<LaunchType[]>([]);
  const totalLaunches = ref<number>(0);
  const loading = ref<boolean>(false);

  const fetchSavedLaunches = async (offset: number = 0, limit: number = 10) => {
    try {
      loading.value = true;
      const response = await axios.get<LaunchResponseType>(`${API_URL}/saved-launches`, {
        params: { offset, limit }
      });
      if (response.data?.data) {
        savedLaunches.value = [...response.data.data];
        totalLaunches.value = response.data.total;
      }
    } catch (error) {
      console.error('Error fetching launches:', error);
    } finally {
      loading.value = false;
    }
  };

  const deleteLaunch = async (launch: LaunchType) => {
    try {
      const { _id } = launch;
      savedLaunches.value = savedLaunches.value.filter((launch: LaunchType) => launch._id !== _id);

      const response = await axios.delete(`${API_URL}/saved-launches/${_id}`);
      
      if (response.status === 204) {
        toastStore.addToast(`Flight-${launch.flight_number} deleted successfully!`, 'success');
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toastStore.addToast(`Error deleting launch: ${error.response?.data?.message}`, 'error');
        console.error('Error deleting launch:', error);
      } else {
        toastStore.addToast('Error deleting launch:', 'error');
        console.error('Error deleting launch:', error);
      }
    }
  };

  return {
    savedLaunches,
    totalLaunches,
    loading,
    fetchSavedLaunches,
    deleteLaunch
  };
});
