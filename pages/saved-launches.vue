<template>
  <div class="container">
    <NavLink
      linkPath="/"
      linkText="Back to Launches"
    />
    <h1>Saved Launches</h1>
    <LaunchTable
      v-if="savedLaunchesStore.savedLaunches.length"
      :launches="savedLaunchesStore.savedLaunches"
      :formatDate="formatDate"
      :onAction="deleteLaunch"
      :loading="savedLaunchesStore.loading"
      actionButtonClass="ed-btn-warning"
      actionButtonText="Delete"
    />
    <div v-else>
      <p>No saved launches.</p>
    </div>
    <Pagination
      :currentPage="pagination.currentPage.value"
      :totalItems="savedLaunchesStore.totalLaunches"
      :limit="limit"
      :onPageChange="handlePageChange"
      buttonClass="ed-btn-primary"
    />
  </div>
  <Toast
    v-if="toasts.length"
    :toasts="toasts"
  />
</template>


<script lang="ts">
  import { defineComponent } from 'vue';

  import Button from '@/components/Button.vue';
  import Toast from '@/components/Toast.vue';
  import LaunchTable from '@/components/LaunchTable.vue';
  import NavLink from '@/components/NavLink.vue';
  import { usePagination } from '@/composables/usePagination';
  import { useDateFormatter } from '@/composables/useDateFormatter';
  import { useSavedLaunchesStore } from '@/stores/savedLaunches';
  import { useToastStore } from '@/stores/toast';
  import type { LaunchType } from '@/types/launch';

  export default defineComponent({
    components: {
      Button,
      Toast,
      LaunchTable,
      NavLink
    },
    setup() {
      const savedLaunchesStore = useSavedLaunchesStore();
      const toastStore = useToastStore();
      const { formatDate } = useDateFormatter();
      const limit = 10;

      const pagination = usePagination(limit, (offset, limit) => {
        savedLaunchesStore.fetchSavedLaunches(offset, limit);
      });

      onMounted(() => {
        savedLaunchesStore.fetchSavedLaunches(0, limit);
      })

      const deleteLaunch = (launch: LaunchType) => {
        savedLaunchesStore.deleteLaunch(launch);
      };

      const handlePageChange = (offset: number) => {
        pagination.offset.value = offset;
        savedLaunchesStore.fetchSavedLaunches(pagination.offset.value, limit);
      };

      return {
        savedLaunchesStore,
        toasts: toastStore.toasts,
        deleteLaunch,
        formatDate,
        pagination,
        limit,
        handlePageChange
      };
    }
  });
</script>
