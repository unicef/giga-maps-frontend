import { describe, expect, test } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import MultiSchoolCommonAccodion from '../multi-school-common-accodion.view';

const mockSchoolDetails = {
  id: '1234',
  name: 'Test School',
  external_id: 'ABC123',
  geopoint: {
    coordinates: [1.2345, 6.7890],
  },
  statistics: {
    num_students: 100,
  },
};

describe('MultiSchoolCommonAccodion', () => {
  test('renders school name and external ID', () => {
    render(<MultiSchoolCommonAccodion schoolDetails={mockSchoolDetails} isOpen={false} onToggle={() => { }} />);

    expect(screen.getByText('Test School')).toBeInTheDocument();
    expect(screen.getByText('ABC123')).toBeInTheDocument();
  });

  test('renders school location', () => {
    render(<MultiSchoolCommonAccodion schoolDetails={mockSchoolDetails} isOpen={false} onToggle={() => { }} />);

    expect(screen.getByTitle('1.2345, 6.789')).toBeInTheDocument();
  });

  test('renders number of students', () => {
    render(<MultiSchoolCommonAccodion schoolDetails={mockSchoolDetails} isOpen={false} onToggle={() => { }} />);

    expect(screen.getByText('100 students')).toBeInTheDocument();
  });

  test('renders number of students empty', () => {
    render(<MultiSchoolCommonAccodion schoolDetails={{ ...mockSchoolDetails, statistics: null }} isOpen={false} onToggle={() => { }} />);

    expect(screen.getByText('students')).toBeInTheDocument();
  });

  test('toggles accordion on click', async () => {
    const user = userEvent.setup();
    const onToggle = jest.fn();
    render(<MultiSchoolCommonAccodion schoolDetails={mockSchoolDetails} isOpen={false} onToggle={onToggle} />);

    const accordionTitle = screen.getByText('Test School');
    await user.click(accordionTitle);

    expect(onToggle).toHaveBeenCalled();
  });
});
