<template>
  <table>
    <thead>
      <tr>
        <th>Flight Number</th>
        <th>Name</th>
        <th>Date</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="launch in launches" :key="launch.flight_number">
        <td>{{ launch.flight_number }}</td>
        <td>{{ launch.name }}</td>
        <td>{{ formatDate(launch.date_utc) }}</td>
        <td>
          <Button
            :buttonClass="actionButtonClass"
            @click="() => onAction(launch)"
            :loading="loading"
          >
            {{ actionButtonText }}
          </Button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  import Button from '@/components/Button.vue';
  import type { LaunchType } from '@/types/launch';

  export default defineComponent({
    components: {
      Button,
    },
    props: {
      launches: {
        type: Array as () => Array<LaunchType>,
        required: true,
      },
      formatDate: {
        type: Function,
        required: true,
      },
      onAction: {
        type: Function,
        required: true,
      },
      loading: {
        type: Boolean,
        default: false,
      },
      actionButtonClass: {
        type: String,
        default: 'ed-btn-primary',
      },
      actionButtonText: {
        type: String,
        default: 'Save',
      },
    },
  });
</script>

<style scoped>
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  th, td {
    padding: 12px;
    text-align: left;
    border: 1px solid #ddd;
  }

  thead {
    background-color: #007bff;
  }

  th {
    background-color: #007bff;
    color: #fff;
  }

  tbody tr:nth-child(odd) {
    background-color: #f9f9f9;
  }

  tbody tr:hover {
    background-color: #f1f1f1;
  }
</style>
