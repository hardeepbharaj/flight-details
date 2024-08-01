<template>
  <nav>
    <router-link :to="linkPath">{{ linkText }}</router-link>
  </nav>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    props: {
      linkPath: {
        type: String,
        required: true,
      },
      linkText: {
        type: String,
        required: true,
      },
    }
  });
</script>

<style scoped>
  nav {
    margin-bottom: 20px;
    text-align: right;
  }

  nav a {
    color: #007bff;
    text-decoration: none;
    font-weight: bold;
    transition: color 0.3s ease;
  }

  nav a:hover {
    color: #0056b3;
  }
</style>