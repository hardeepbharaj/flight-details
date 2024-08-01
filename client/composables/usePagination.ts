import { ref, computed } from 'vue';

import type { OnPageChangeFnType } from '@/types/pagination';

export function usePagination(limit: number, loadItems: OnPageChangeFnType) {
  const offset = ref(0);
  const currentPage = computed(() => Math.floor(offset.value / limit) + 1);

  const previousPage = (totalItems: number) => {
    if (offset.value >= limit) {
      offset.value -= limit;
      loadItems(offset.value, limit);
    }
  };

  const nextPage = (totalItems: number) => {
    if (offset.value + limit < totalItems) {
      offset.value += limit;
      loadItems(offset.value, limit);
    }
  };

  return {
    offset,
    currentPage,
    previousPage,
    nextPage,
  };
}
