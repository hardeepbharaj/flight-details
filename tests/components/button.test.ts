import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';

import Button from '@/components/Button.vue';

describe('Button.vue', () => {
  it('renders with the correct class', () => {
    const buttonClass = 'ed-btn-primary';
    const wrapper = mount(Button, {
      props: { buttonClass },
    });
    expect(wrapper.classes()).toContain(buttonClass);
  });

  it('emits click event when clicked', async () => {
    const wrapper = mount(Button);
    await wrapper.trigger('click');
    expect(wrapper.emitted()).toHaveProperty('click');
  });

  it('is disabled when loading is true', () => {
    const wrapper = mount(Button, {
      props: { loading: true },
    });
    const button = wrapper.find('button');
    expect(button.element.disabled).toBe(true);
  });

  it('is not disabled when loading is false', () => {
    const wrapper = mount(Button, {
      props: { loading: false },
    });
    const button = wrapper.find('button');
    expect(button.element.disabled).toBe(false);
  });
});
