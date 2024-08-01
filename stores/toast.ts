import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { ToastType } from '@/types/toast';

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<ToastType[]>([]);
  let toastId = 0;
  
  const addToast = (message: string, type = 'error') => {
    const id = toastId++;

    toasts.value.push({ message, type, id });

    setTimeout(() => {
      removeToast(id);
    }, 3000);
  };

  const removeToast = (id: number) => {
    const index = toasts.value.findIndex(toast => toast.id === id);
    if (index !== -1) {
      toasts.value.splice(index, 1);
    }
  };

  return {
    toasts,
    addToast,
    removeToast
  };
});
