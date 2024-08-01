import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';

import { useToastStore } from '@/stores/toast';

describe('useToastStore', () => {
  let toastStore: ReturnType<typeof useToastStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    toastStore = useToastStore();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('adds a toast', () => {
    toastStore.addToast('Test message', 'success');
    expect(toastStore.toasts).toHaveLength(1);
    expect(toastStore.toasts[0]).toEqual({
      id: 0,
      message: 'Test message',
      type: 'success',
    });
  });

  it('removes a toast', () => {
    toastStore.addToast('Test message', 'success');
    expect(toastStore.toasts).toHaveLength(1);

    toastStore.removeToast(0);
    expect(toastStore.toasts).toHaveLength(0);
  });

  it('automatically removes a toast after 3 seconds', () => {
    toastStore.addToast('Test message', 'success');
    expect(toastStore.toasts).toHaveLength(1);

    vi.advanceTimersByTime(3000);

    expect(toastStore.toasts).toHaveLength(0);
  });

  it('adds multiple toasts with unique IDs', () => {
    toastStore.addToast('First message', 'success');
    toastStore.addToast('Second message', 'error');

    expect(toastStore.toasts).toHaveLength(2);
    expect(toastStore.toasts[0]).toEqual({
      id: 0,
      message: 'First message',
      type: 'success',
    });
    expect(toastStore.toasts[1]).toEqual({
      id: 1,
      message: 'Second message',
      type: 'error',
    });
  });
});
