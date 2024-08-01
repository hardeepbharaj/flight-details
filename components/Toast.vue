<template>
  <Teleport to="body">
    <div class="toast-container">
      <div v-for="toast in toasts" :key="toast.id" class="toast" :class="toast.type">
        <span>{{ toast.message }}</span>
        <button
          id="toast-close"
          @click="removeToast(toast.id)"
        >
          &times;
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  import { useToastStore } from '@/stores/toast';
  import type { ToastType } from '@/types/toast';

  export default defineComponent({
    props: {
      toasts: {
        type: Array<ToastType>,
        required: true,
      },
    },
    setup(props) {
      const toastStore = useToastStore();

      const removeToast = (id: number) => {
        toastStore.removeToast(id);
      };

      return {
        removeToast,
      };
    },
  });
</script>

<style scoped>
  .toast-container {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10000;
  }

  .toast {
    max-width: 300px;
    padding: 8px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    color: #721c24;
    background-color: #f8d7da;
    border-radius: 5px;  
    box-shadow: 0 4px 5px rgba(0, 0, 0, 0.1);
  }

  #toast-close {
    font-size: 14px;
    margin-left: 8px;
  }

  .toast button {
    background: none;
    border: none;
    color: inherit;
    font-size: 16px;
    cursor: pointer;
  }

  .toast.error {
    background-color: #d9534f;
    color: #fff;
  }

  .toast.success {
    background-color: #007bff;
    color: #fff;
  }
</style>