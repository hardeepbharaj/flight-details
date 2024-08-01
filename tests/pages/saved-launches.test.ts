import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTestingPinia } from '@pinia/testing';

import { useSavedLaunchesStore } from '@/stores/savedLaunches';
import { useToastStore } from '@/stores/toast';
import SavedLaunches from '@/pages/saved-launches.vue';
import Toast from '@/components/Toast.vue';
import Button from '@/components/Button.vue';

import { createRouter, createMemoryHistory } from 'vue-router';

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    {
      path: '/',
      component: SavedLaunches,
    },
  ],
});

describe('SavedLaunches Component', () => {
  let pinia: ReturnType<typeof createTestingPinia>;
  let savedLaunchesStore: ReturnType<typeof useSavedLaunchesStore>;
  let toastStore: ReturnType<typeof useToastStore>;

  beforeEach(async () => {
    pinia = createTestingPinia();
    savedLaunchesStore = useSavedLaunchesStore(pinia);
    toastStore = useToastStore(pinia);
    savedLaunchesStore.savedLaunches = [];
    toastStore.toasts = [];
  });

  afterEach(() => {
    savedLaunchesStore.savedLaunches = [];
    toastStore.toasts = [];
    document.body.innerHTML = '';
  });

  it('renders the component correctly', async () => {
    const wrapper = mount(SavedLaunches, {
      global: {
        plugins: [pinia, router],
        components: {
          Button,
          Toast,
        },
      },
    });

    await wrapper.vm.$nextTick();

    const navLink = wrapper.find('nav a');
    expect(navLink.exists()).toBe(true);
    expect(navLink.text()).toBe('Back to Launches');

    const heading = wrapper.find('h1');
    expect(heading.exists()).toBe(true);
    expect(heading.text()).toBe('Saved Launches');

    const noSavedLaunchesMessage = wrapper.find('div p');
    expect(noSavedLaunchesMessage.exists()).toBe(true);
    expect(noSavedLaunchesMessage.text()).toBe('No saved launches.');
  });

  it('displays saved launches and handles delete action', async () => {
    savedLaunchesStore.savedLaunches = [
      { _id: '1', flight_number: 1, name: 'Falcon 1', date_utc: '2006-03-24T22:30:00.000Z' },
      { _id: '2', flight_number: 2, name: 'Falcon 9', date_utc: '2010-06-04T18:45:00.000Z' },
    ];

    const wrapper = mount(SavedLaunches, {
      global: {
        plugins: [pinia, router],
        components: {
          Button,
          Toast,
        },
      },
    });

    await nextTick();

    const rows = wrapper.findAll('tbody tr');
    expect(rows).toHaveLength(2);

    const deleteLaunchSpy = vi.spyOn(savedLaunchesStore, 'deleteLaunch');

    const deleteButton = rows[0].find('button');

    await deleteButton.trigger('click');

    expect(deleteLaunchSpy).toHaveBeenCalledWith(savedLaunchesStore.savedLaunches[0]);
  });

  it('displays toast messages', async () => {
    toastStore.toasts = [
      { id: 1, message: 'Launch saved!', type: 'success' },
    ];

    const wrapper = mount(SavedLaunches, {
      global: {
        plugins: [pinia, router],
        components: {
          Button,
          Toast,
        },
      },
    });

    await wrapper.vm.$nextTick();

    const toastElements = document.body.querySelectorAll('.toast');
    expect(toastElements).toHaveLength(1);
    expect(toastElements[0].textContent).toContain('Launch saved!');
  });

  it('removes a toast when the close button is clicked', async () => {
    toastStore.toasts = [
      { id: 1, message: 'Launch saved!', type: 'success' },
      { id: 2, message: 'Error occurred!', type: 'error' },
    ];

    const removeToastSpy = vi.spyOn(toastStore, 'removeToast');

    const wrapper = mount(SavedLaunches, {
      global: {
        plugins: [pinia, router],
        components: {
          Button,
          Toast,
        },
      },
    });

    await wrapper.vm.$nextTick();

    const closeButtons = document.body.querySelectorAll('#toast-close');
    expect(closeButtons).toHaveLength(2);

    await (closeButtons[0] as HTMLElement).click();

    expect(removeToastSpy).toHaveBeenCalledWith(1);
  });
});
