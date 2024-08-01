import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';

import LaunchTable from '@/components/LaunchTable.vue';
import Button from '@/components/Button.vue';

describe('LaunchTable', () => {
  const launches = [
    { _id: '1', flight_number: 1, name: 'Falcon 1', date_utc: '2006-03-24T22:30:00.000Z' },
    { _id: '2', flight_number: 2, name: 'Falcon 9', date_utc: '2010-06-04T18:45:00.000Z' },
  ];

  const formatDate = (date: string): string => new Date(date).toLocaleDateString();

  const factory = (props = {}) => {
    return mount(LaunchTable, {
      props: {
        launches,
        formatDate,
        onAction: vi.fn(),
        loading: false,
        actionButtonClass: 'ed-btn-warning',
        actionButtonText: 'Delete',
        ...props
      },
      global: {
        components: {
          Button,
        },
      },
    });
  };

  it('renders the correct number of rows', () => {
    const wrapper = factory();

    const rows = wrapper.findAll('tbody tr');
    expect(rows).toHaveLength(launches.length);
  });

  it('renders the correct content for each cell', () => {
    const wrapper = factory();

    const firstRowCells = wrapper.findAll('tbody tr')[0].findAll('td');
    expect(firstRowCells[0].text()).toBe(String(launches[0].flight_number));
    expect(firstRowCells[1].text()).toBe(launches[0].name);
    expect(firstRowCells[2].text()).toBe(formatDate(launches[0].date_utc));
  });

  it('renders the correct button text', () => {
    const wrapper = factory();

    const actionButton = wrapper.findAll('tbody tr')[0].find('button');
    expect(actionButton.text()).toBe('Delete');
  });

  it('calls onAction when button is clicked', async () => {
    const onActionMock = vi.fn();
    const wrapper = factory({ onAction: onActionMock });

    const actionButton = wrapper.findAll('tbody tr')[0].find('button');
    await actionButton.trigger('click');

    expect(onActionMock).toHaveBeenCalledWith(launches[0]);
  });
});
