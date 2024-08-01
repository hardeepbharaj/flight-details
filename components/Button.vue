<template>
  <button :class="buttonClass" @click="handleClick" :disabled="loading">
  <slot />
</button>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    props: {
      buttonClass: {
        type: String,
        default: '',
      },
      loading: {
        type: Boolean,
        default: false,
      }
    },
    emits: ['click'],
    methods: {
      handleClick() {
        this.$emit('click');
      },
    },
  });
</script>

<style scoped>
  button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }

  .ed-btn-primary {
    background-color: #007bff;
  }

  .ed-btn-primary:active {
    background-color: #0056b3
  }

  .ed-btn-warning {
    background-color: #d9534f;
  }

  .ed-btn-warning:active {
    background-color: #c9302c;
  }
</style>