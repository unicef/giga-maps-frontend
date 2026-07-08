import React from 'react';
import { render } from '@testing-library/react';
import SchoolViewConnectivityLayer from '../school-view-connectivity-layer/school-view-connectivity-layer.view';
import { testWrapper } from '~/tests/test-wrapper';
import { router } from '~/core/routes';
import "~/core/i18n/instance"

test('renders SchoolViewConnectivityLayer component correctly', () => {
  const { getAllByText } = render(testWrapper(
    <SchoolViewConnectivityLayer />
  ));
  expect(getAllByText('Average Download Speed', { exact: false })[0]).toBeInTheDocument();
});

test('check SchoolViewConnectivityLayer with multiple school ids', () => {
  router.navigate(`/map/schools?country=AI&school_ids=12,13`);
  const { container } = render(testWrapper(<SchoolViewConnectivityLayer />));
  expect(container).toBeInTheDocument();
});
