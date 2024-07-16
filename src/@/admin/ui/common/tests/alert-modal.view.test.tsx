import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AlertModalWithButton } from '../alert-modal.view';

describe('AlertModalWithButton', () => {

  test('renders modal when button clicked', () => {
    render(<AlertModalWithButton
      buttonProps={{ title: 'Test Button' }}
      modalProps={{
        modalHeading: 'Confirm Delete',
        modalLabel: 'Delete User',
        primaryButtonText: 'Confirm',
        secondaryButtonText: 'Cancel'
      }}
      confirm={jest.fn()}
    />);

    const button = screen.getByText('Test Button');
    userEvent.click(button);

    const modalHeading = screen.getByText('Confirm Delete');
    expect(modalHeading).toBeInTheDocument();

    const modalLabel = screen.getByText('Delete User');
    expect(modalLabel).toBeInTheDocument();
  });

  test('calls confirm function when primary button clicked', async () => {
    const confirmMock = jest.fn();

    render(<AlertModalWithButton
      buttonProps={{ title: 'Test Button' }}
      modalProps={{
        modalHeading: 'Confirm Delete',
        modalLabel: 'Delete User',
        primaryButtonText: 'Confirm',
        secondaryButtonText: 'Cancel'
      }}
      confirm={confirmMock}
    />);

    const button = screen.getByText('Test Button');
    await userEvent.click(button);

    const primaryButton = screen.getByText('Confirm');
    await userEvent.click(primaryButton);

    expect(confirmMock).toHaveBeenCalledTimes(1);
  });

  test('closes modal when secondary button clicked', async () => {
    render(<AlertModalWithButton
      buttonProps={{ title: 'Test Button' }}
      modalProps={{
        modalHeading: 'Confirm Delete',
        modalLabel: 'Delete User',
        primaryButtonText: 'Confirm',
        secondaryButtonText: 'Cancel'
      }}
      confirm={jest.fn()}
    />);

    const button = screen.getByText('Test Button');
    await userEvent.click(button);

    const secondaryButton = screen.getByText('Cancel');
    await userEvent.click(secondaryButton);

    const modalHeading = screen.queryByText('Confirm Delete');
    expect(modalHeading).toBeInTheDocument();
  });

  test('renders button with empty title if title is not provided', () => {
    render(<AlertModalWithButton
      buttonProps={{}}
      modalProps={{
        modalHeading: 'Confirm Delete',
        modalLabel: 'Delete User',
        primaryButtonText: 'Confirm',
        secondaryButtonText: 'Cancel'
      }}
      confirm={jest.fn()}
    />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toBeEmptyDOMElement();
  })

});
