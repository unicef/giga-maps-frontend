import React from 'react';
import { render } from '@testing-library/react';
import SchoolViewConnectivityLayer from '../school-view-connectivity-layer/school-view-connectivity-layer.view';
import { testWrapper } from '~/tests/jest-wrapper';
import { router } from '~/core/routes';
import "~/core/i18n/instance"

test('renders SchoolViewConnectivityLayer component correctly', () => {
  const { getAllByText } = render(testWrapper(
    <SchoolViewConnectivityLayer />
  ));
  expect(getAllByText('Real-time Connectivity', { exact: false })[0]).toBeInTheDocument();
});

test('check SchoolViewConnectivityLayer with multiple school ids', () => {
  router.navigate(`/map/schools?country=AI&school_ids=12,13`);
  const { getAllByText } = render(testWrapper(<SchoolViewConnectivityLayer />));
  expect(getAllByText('Real-time Connectivity', { exact: false })[0]).toBeInTheDocument();
});