import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import { RouterLinkStub } from '@vue/test-utils';

import NavLink from '@/components/NavLink.vue';

describe('NavLink', () => {
  it('renders the router-link with correct path and text', () => {
    const linkPath = '/home';
    const linkText = 'Home';

    const wrapper = mount(NavLink, {
      props: {
        linkPath,
        linkText,
      },
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });

    const routerLink = wrapper.findComponent(RouterLinkStub);

    expect(routerLink.props('to')).toBe(linkPath);

    expect(routerLink.text()).toBe(linkText);
  });
});
