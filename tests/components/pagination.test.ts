import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';

import Pagination from '@/components/Pagination.vue';
import Button from '@/components/Button.vue';
import { usePagination } from '@/composables/usePagination';
import type { OnPageChangeFnType, LaunchResponseType } from '@/types/pagination';

const createMockOnPageChange = (): OnPageChangeFnType =>
  vi.fn(() => Promise.resolve());

vi.mock('@/composables/usePagination', () => ({
  usePagination: vi.fn()
}));

describe('Pagination', () => {
  const factory = (props: LaunchResponseType) => {
    const usePaginationMock = usePagination as vi.Mock;

    const paginationProps = {
      currentPage: props.currentPage || 1,
      totalItems: props.totalItems || 50,
      limit: props.limit || 10,
      onPageChange: props.onPageChange || createMockOnPageChange(),
      buttonClass: props.buttonClass || 'ed-btn-primary',
    }

    const { currentPage, limit,  } = paginationProps

    usePaginationMock.mockReturnValue({
      offset: ref((currentPage  - 1) * (limit || 10)),
      currentPage: computed(() => currentPage),
      previousPage: vi.fn(() => {
        paginationProps.onPageChange?.(currentPage - 1, limit);
      }),
      nextPage: vi.fn(() => {
        paginationProps.onPageChange?.(currentPage + 1, limit);
      })
    });

    return mount(Pagination, {
      props: {
        ...paginationProps
      },
      global: {
        components: {
          Button,
        },
      },
    });
  };

  it('renders correctly with required props', () => {
    const wrapper = factory({ currentPage: 1 });

    expect(wrapper.exists()).toBe(true);

    const currentPageText = wrapper.find('[data-test-id="current-page-text"]');

    expect(currentPageText.exists()).toBe(true);
    expect(currentPageText.text()).toBe('Page 1');
  });

  it('disables previous button on the first page', () => {
    const wrapper = factory({ currentPage: 1 });

    const prevButton = wrapper.findAllComponents(Button).at(0);

    if (prevButton) {
      expect(prevButton.element.hasAttribute('disabled')).toBe(true);
    } else {
      throw new Error('Previous button not found');
    }
  });

  it('disables next button on the last page', () => {
    const wrapper = factory({ currentPage: 5, totalItems: 50 });

    const nextButton = wrapper.findAllComponents(Button).at(1);

    if (nextButton) {
      expect(nextButton.element.hasAttribute('disabled')).toBe(true);
    } else {
      throw new Error('Next button not found');
    }
  });

  it('calls onPageChange with the correct arguments when previous button is clicked', async () => {
    const onPageChangeMock = vi.fn();
    const wrapper = factory({ currentPage: 2,  limit: 10, onPageChange: onPageChangeMock });

    const prevButton = wrapper.find('[data-test-id="prev-button"]'); 
    if (prevButton.exists()) {
      await prevButton.trigger('click');

      expect(onPageChangeMock).toHaveBeenCalledTimes(1);
  
      const calls = onPageChangeMock.mock.calls;

      expect(calls).toHaveLength(1);
      expect(calls[0][0]).toBe(1);
      expect(calls[0][1]).toBe(10);
    } else {
      throw new Error('Previous button not found');
    }
  });

  it('calls onPageChange with the correct arguments when next button is clicked', async () => {
    const onPageChangeMock = vi.fn();
    const wrapper = factory({ currentPage: 1, onPageChange: onPageChangeMock });

    const nextButton = wrapper.find('[data-test-id="next-button"]');
    if (nextButton.exists()) {
      await nextButton.trigger('click');

      expect(onPageChangeMock).toHaveBeenCalledTimes(1);

      const calls = onPageChangeMock.mock.calls;
      
      expect(calls).toHaveLength(1);
      expect(calls[0][0]).toBe(2);
      expect(calls[0][1]).toBe(10);
    } else {
      throw new Error('Next button not found');
    }
  });
});
