import { defineStore } from 'pinia';
import axios, { AxiosError } from 'axios';

import { useToastStore } from '@/stores/toast';
import type { LaunchType, LaunchResponseType } from '@/types/launch';


export const useLaunchesStore = defineStore('launches', () => {
  const toastStore = useToastStore();
  const { public: { apiUrl: API_URL } } = useRuntimeConfig();
  const launches = ref<LaunchType[]>([]);
  const totalLaunches = ref<number>(0);
  const loading = ref<boolean>(false);
  
  const fetchLaunches = async (offset: number = 0, limit: number = 10) => {
    try {
      loading.value = true;
      const response = await axios.get<LaunchResponseType>(`${API_URL}/launches`, {
        params: { offset, limit }
      });
      if (response.data?.data) {
        launches.value = [...response.data.data];
        totalLaunches.value = response.data.total;
      }
    } catch (error) {
      console.error('Error fetching launches:', error);
    } finally {
      loading.value = false;
    }
  };

  const saveLaunch = async (launch: LaunchType) => {
    try {
      const response = await axios.post(`${API_URL}/launches`, launch);
      if (response.status === 201) {
        toastStore.addToast(`Flight-${launch.flight_number} saved successfully!`, 'success');
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toastStore.addToast(`Error saving launch: ${error.response?.data?.message}`, 'error');
        console.error('Error saving launch:', error);
      } else {
        toastStore.addToast('Error saving launch.', 'error');
        console.error('Error saving launch:', error);
      }
    }
  };

  return { loading, launches, totalLaunches, fetchLaunches, saveLaunch };
});
