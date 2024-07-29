import { render, screen } from '@testing-library/react';
import HistoryButtons from '../history-buttons.view';
import userEvent from '@testing-library/user-event';
import { changeHistoryIntervalUnit } from '~/@/sidebar/history-graph.model';
import { IntervalUnit } from '~/lib/date-fns-kit/types';

describe('Layer schools connectivity status', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders "Weekly" and "Monthly" buttons correctly', () => {
    render(<HistoryButtons isWeek={true} />);
    const weeklyButton = screen.getByText('Weekly');
    const monthlyButton = screen.getByText('Monthly');
    expect(weeklyButton).toMatchSnapshot();
    expect(monthlyButton).toMatchSnapshot();
  });

  it('calls changeHistoryIntervalUnit with IntervalUnit.week when "Weekly" button is clicked', () => {
    render(<HistoryButtons isWeek={true} />);

    const weeklyButton = screen.getByText('Weekly');
    expect(weeklyButton).toMatchSnapshot();
  });

  it('calls changeHistoryIntervalUnit with IntervalUnit.month when "Monthly" button is clicked', () => {
    render(<HistoryButtons isWeek={false} />);
    const monthlyButton = screen.getByText('Monthly');
    expect(monthlyButton).toMatchSnapshot();
  });
});
