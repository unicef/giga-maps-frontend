import { describe, expect, test } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import MultiSchoolCommonAccodion from '../multi-school-common-accodion.view';
import { fetchMockResponse } from '~/tests/fetchMock';
import { fetchLayerListFx } from '~/api/project-connect';
import { onSelectMainLayer } from '~/@/sidebar/sidebar.model';
import { testWrapper } from '~/tests/jest-wrapper';

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

  beforeEach(() => {
    fetchMock.mockResponse(fetchMockResponse)
  });

  test('renders school name and external ID', async () => {
    render(<MultiSchoolCommonAccodion schoolDetails={mockSchoolDetails} isOpen={false} onToggle={jest.fn()} />);

    expect(screen.getByText('Test School')).toBeInTheDocument();
    expect(screen.getByText('ABC123')).toBeInTheDocument();
  });

  test('renders school location', async () => {
    await fetchLayerListFx();
    onSelectMainLayer(5);
    render(<MultiSchoolCommonAccodion schoolDetails={mockSchoolDetails} isOpen={false} onToggle={() => { }} />);

    expect(screen.getByTitle('1.2345, 6.789')).toBeInTheDocument();
  });

  test('renders number of students', () => {
    onSelectMainLayer(45);
    render(<MultiSchoolCommonAccodion schoolDetails={mockSchoolDetails} isOpen={false} onToggle={() => { }} />);

    expect(screen.getByText('100 students')).toBeInTheDocument();
  });

  test('renders number of students empty', () => {
    render(testWrapper(<MultiSchoolCommonAccodion schoolDetails={{ ...mockSchoolDetails, statistics: null }} isOpen={false} onToggle={() => { }} />));

    expect(screen.getByText('students')).toBeInTheDocument();
  });

  test('renders single school isOpen = true and static layer selected', () => {
    render(testWrapper(<MultiSchoolCommonAccodion schoolDetails={{ ...mockSchoolDetails, statistics: null }} isOpen={true} onToggle={() => { }} />));
    expect(screen.getByText('Test School')).toBeInTheDocument();
  });

  test('renders single school isOpen = true and live layer selected', () => {
    onSelectMainLayer(5);
    render(testWrapper(<MultiSchoolCommonAccodion schoolDetails={{ ...mockSchoolDetails, statistics: null }} isOpen={true} onToggle={() => { }} />));
    expect(screen.getByText('Test School')).toBeInTheDocument();
  });

  test('renders single school isOpen = true and no layer selected', () => {
    onSelectMainLayer(null);
    render(testWrapper(<MultiSchoolCommonAccodion schoolDetails={{ ...mockSchoolDetails, statistics: null }} isOpen={true} onToggle={() => { }} />));
    expect(screen.getByText('Test School')).toBeInTheDocument();
  });

  test('toggles accordion on click', async () => {
    const user = userEvent.setup();
    const onToggle = jest.fn();
    render(testWrapper(<MultiSchoolCommonAccodion schoolDetails={mockSchoolDetails} isOpen={false} onToggle={onToggle} />));

    const accordionTitle = screen.getByText('Test School');
    await user.click(accordionTitle);

    expect(onToggle).toHaveBeenCalled();
  });
});
