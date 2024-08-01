<template>
  <div class="pagination">
    <Button
      data-test-id="prev-button"
      :buttonClass="buttonClass"
      @click="previousPage"
      :disabled="isPreviousDisabled"
    >
      Previous
    </Button>
    <span data-test-id="current-page-text">Page {{ currentPage }}</span>
    <Button
      data-test-id="next-button"
      :buttonClass="buttonClass"
      @click="nextPage"
      :disabled="isNextDisabled"
    >
      Next
    </Button>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue';

  import Button from '@/components/Button.vue';
  import { usePagination } from '@/composables/usePagination';

  export default defineComponent({
    components: {
      Button,
    },
    props: {
      currentPage: {
        type: Number,
        required: true,
      },
      totalItems: {
        type: Number,
        required: true,
      },
      limit: {
        type: Number,
        required: true,
      },
      onPageChange: {
        type: Function as PropType<(offset: number, limit: number) => void>,
        required: true,
      },
      buttonClass: {
        type: String,
        default: 'ed-btn-primary',
      },
    },
    setup(props) {
      const { offset, currentPage, previousPage, nextPage } = usePagination(props.limit, props.onPageChange);

      const totalPages = computed(() => Math.ceil(props.totalItems / props.limit));
      const isPreviousDisabled = computed(() => currentPage.value <= 1);
      const isNextDisabled = computed(() => currentPage.value >= totalPages.value);

      return {
        previousPage: () => previousPage(props.totalItems),
        nextPage: () => nextPage(props.totalItems),
        isPreviousDisabled,
        isNextDisabled,
        currentPage,
      };
    },
  });
</script>

<style scoped>
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin-top: 20px;
  }

  .pagination button {
    padding: 8px 12px;
    font-size: 14px;
    cursor: pointer;
  }

  .pagination span {
    font-size: 14px;
  }
</style>