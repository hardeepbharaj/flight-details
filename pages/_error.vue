<template>
  <div class="error">
    <h1>{{ error.statusCode }}</h1>
    <p>{{ error.message }}</p>
    <router-link to="/">Go back to Home</router-link>
  </div>
</template>

<script lang="ts" setup>
  defineProps<{
    error: {
      statusCode: number;
      message: string;
    }
  }>();
</script>

<style scoped>
  .error {
    text-align: center;
    margin-top: 50px;
  }
</style>
