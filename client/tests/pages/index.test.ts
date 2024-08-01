import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { createRouter, createMemoryHistory } from 'vue-router';

import SpaceXLaunches from '@/pages/index.vue';
import savedLaunches from '@/pages/saved-launches.vue';
import { useLaunchesStore } from '@/stores/launches';
import { useToastStore } from '@/stores/toast';
import Button from '@/components/Button.vue';
import Toast from '@/components/Toast.vue';

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    {
      path: '/saved-launches',
      component: savedLaunches
    },
  ],
});

describe('SpaceXLaunches Component', () => {
  let pinia: ReturnType<typeof createTestingPinia>;
  let launchesStore: ReturnType<typeof useLaunchesStore>;
  let toastStore: ReturnType<typeof useToastStore>;

  beforeEach(() => {
    pinia = createTestingPinia();
    launchesStore = useLaunchesStore(pinia);
    toastStore = useToastStore(pinia);
    launchesStore.launches = [];
    toastStore.toasts = [];
  });

  it('renders the component correctly', async () => {
    const wrapper = mount(SpaceXLaunches, {
      global: {
        plugins: [pinia, router],
        components: {
          Button,
          Toast,
        },
      },
    });

    await wrapper.vm.$nextTick();

    expect(wrapper.find('nav').exists()).toBe(true);
    expect(wrapper.find('nav a').text()).toBe('Saved Launches');

    expect(wrapper.find('thead').exists()).toBe(true);
    expect(wrapper.findAll('th')).toHaveLength(4);
  });

  it('displays launches and handles save action', async () => {
    launchesStore.launches = [
      { flight_number: 1, name: 'Falcon 1', date_utc: '2006-03-24T22:30:00.000Z' },
      { flight_number: 2, name: 'Falcon 9', date_utc: '2010-06-04T18:45:00.000Z' },
    ];

    const wrapper = mount(SpaceXLaunches, {
      global: {
        plugins: [pinia],
        components: {
          Button,
          Toast,
        },
      },
    });

    await wrapper.vm.$nextTick();

    const rows = wrapper.findAll('tbody tr');
    expect(rows).toHaveLength(2);

    const saveButton = rows[0].find('button');
    await saveButton.trigger('click');

    expect(launchesStore.saveLaunch).toHaveBeenCalledWith(launchesStore.launches[0]);
  });

  it('displays toast messages', async () => {
    toastStore.toasts = [
      { id: 1, message: 'Launch saved!', type: 'success' },
    ];

    const wrapper = mount(SpaceXLaunches, {
      global: {
        plugins: [pinia],
        components: {
          Button,
          Toast,
        },
      },
    });

    await wrapper.vm.$nextTick();

    const toastMessages = document.body.querySelectorAll('.toast');
    expect(toastMessages).toHaveLength(1);
    expect(toastMessages[0].textContent).toContain('Launch saved!');
  });
});
