<template>
  <div class="container">
    <NavLink 
      linkPath="/saved-launches"
      linkText="Saved Launches"
    />
    <h1>SpaceX Launches</h1>
    <LaunchTable
      :launches="launchesStore.launches"
      :formatDate="formatDate"
      :onAction="saveLaunch"
      :loading="launchesStore.loading"
      actionButtonClass="ed-btn-primary"
      actionButtonText="Save"
    />
    <Pagination
      :currentPage="pagination.currentPage.value"
      :totalItems="launchesStore.totalLaunches"
      :limit="limit"
      :onPageChange="handlePageChange"
      buttonClass="ed-btn-primary"
    />
    <Toast
      v-if="toasts.length"
      :toasts="toasts"
    />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  import Button from '@/components/Button.vue';
  import Toast from '@/components/Toast.vue';
  import LaunchTable from '@/components/LaunchTable.vue';
  import NavLink from '@/components/NavLink.vue';
  import { usePagination } from '@/composables/usePagination';
  import { useDateFormatter } from '@/composables/useDateFormatter';
  import { useLaunchesStore } from '@/stores/launches';
  import { useToastStore } from '@/stores/toast';
  import type { LaunchType } from '@/types/launch.ts';

  export default defineComponent({
    components: {
      Button,
      Toast,
      LaunchTable,
      NavLink
    },
    setup() {
      const launchesStore = useLaunchesStore();
      const toastStore = useToastStore();
      const { formatDate } = useDateFormatter();

      const limit = 10;

      const pagination = usePagination(limit, (offset: number, limit: number) => {
        launchesStore.fetchLaunches(offset, limit);
      });

      onMounted(() => {
        launchesStore.fetchLaunches();
      });

      const saveLaunch = (launch: LaunchType) => {
        launchesStore.saveLaunch(launch);
      };

      const handlePageChange = (offset: number) => {
        pagination.offset.value = offset;
        launchesStore.fetchLaunches(pagination.offset.value, limit);
      };

      return {
        launchesStore,
        toasts: toastStore.toasts,
        saveLaunch,
        pagination,
        limit,
        formatDate,
        handlePageChange
      };
    }
  });
</script>
