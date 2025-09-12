import { describe, expect, test } from '@jest/globals';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createEvent } from 'effector';
import { $formFilterData } from '~/@/admin/models/filter-list.model';
import { setPayload } from '~/lib/effector-kit';
import FilterDropdownFields from '../filter-dropdown-filter';


const updateFormData = createEvent();
$formFilterData.on(updateFormData, setPayload);

describe('FilterDropdownFields', () => {
  test('renders nothing when not dropdown type', () => {
    updateFormData({ type: 'text' });
    const { container } = render(<FilterDropdownFields />);
    expect(container.firstChild).toBeNull();
  });

  test('renders radio buttons for choice type', () => {
    updateFormData({
      type: 'DROPDOWN',
      options: { live_choices: false, choices: [] }
    });
    render(<FilterDropdownFields />);
    expect(screen.getByText('Auto')).toBeInTheDocument();
    expect(screen.getByText('Static')).toBeInTheDocument();
  });

  test('renders static choices form when live_choices is false', () => {
    updateFormData({
      type: 'DROPDOWN',
      options: {
        live_choices: false,
        choices: [{ label: 'Choice 1', value: 'value1' }]
      }
    });
    render(<FilterDropdownFields />);
    expect(screen.getByText('Add Choices')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });

  test('can add new choice', async () => {
    updateFormData({
      type: 'DROPDOWN',
      options: {
        live_choices: false,
        choices: [{ label: 'Choice 1', value: 'value1' }]
      }
    });
    render(<FilterDropdownFields />);
    const addButton = screen.getByText('Add More Choices');
    await userEvent.click(addButton);
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  test('can remove choice', async () => {
    updateFormData({
      type: 'DROPDOWN',
      options: {
        live_choices: false,
        choices: [
          { label: 'Choice 1', value: 'value1' },
          { label: 'Choice 2', value: 'value2' }
        ]
      }
    });
    render(<FilterDropdownFields />);
    const removeButtons = screen.getAllByLabelText('Remove option');
    await userEvent.click(removeButtons[0]);
    expect(screen.queryByText('Option 2')).not.toBeInTheDocument();
  });

  test('can edit choice label and value', async () => {
    updateFormData({
      type: 'DROPDOWN',
      options: {
        live_choices: false,
        choices: [{ label: '', value: '' }]
      }
    });
    render(<FilterDropdownFields />);

    const labelInput = screen.getByPlaceholderText('Enter choice label');
    const valueInput = screen.getByPlaceholderText('Enter choice db value');

    await act(async () => {
      await userEvent.type(labelInput, 'New Label');
      await userEvent.type(valueInput, 'new_value');
    });

    expect(labelInput).toHaveValue('New Label');
    expect(valueInput).toHaveValue('new_value');
  });

  test('hides choices form when live_choices is true', () => {
    updateFormData({
      type: 'DROPDOWN',
      options: {
        live_choices: true,
        choices: null
      }
    });
    render(<FilterDropdownFields />);
    expect(screen.queryByText('Add Choices')).not.toBeInTheDocument();
  });
});
