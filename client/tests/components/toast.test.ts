import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { createTestingPinia } from '@pinia/testing';
import { useToastStore } from '@/stores/toast';

import Toast from '@/components/Toast.vue';

describe('Toast Component', () => {
  let pinia: ReturnType<typeof createTestingPinia>;
  let toastStore: ReturnType<typeof useToastStore>;

  beforeEach(() => {
    pinia = createTestingPinia();
    toastStore = useToastStore(pinia);
  });

  afterEach(() => {
    toastStore.toasts = [];
    document.body.innerHTML = '';
  });

  it('should display the correct number of toasts', async () => {
    toastStore.toasts = [
      { id: 1, message: 'First toast message', type: 'success' },
      { id: 2, message: 'Second toast message', type: 'error' },
    ];

    const wrapper = mount(Toast, {
      props: {
        toasts: toastStore.toasts,
      },
      global: {
        plugins: [pinia],
      },
    });

    await wrapper.vm.$nextTick();

    const toastElements = document.body.querySelectorAll('.toast');

    expect(toastElements).toHaveLength(2);
  });

  it('removes a toast when the close button is clicked', async () => {
    toastStore.toasts = [
      { id: 1, message: 'First toast message', type: 'success' },
      { id: 2, message: 'Second toast message', type: 'error' },
    ];

    const removeToastSpy = vi.spyOn(toastStore, 'removeToast');

    const wrapper = mount(Toast, {
      global: {
        plugins: [pinia],
      },
      props: {
        toasts: toastStore.toasts,
      },
    });

    await wrapper.vm.$nextTick();

    const closeButtons = document.body.querySelectorAll('#toast-close');

    expect(closeButtons).toHaveLength(2);

    await (closeButtons[0] as HTMLElement).click();

    expect(removeToastSpy).toHaveBeenCalledWith(1);
  });
});
