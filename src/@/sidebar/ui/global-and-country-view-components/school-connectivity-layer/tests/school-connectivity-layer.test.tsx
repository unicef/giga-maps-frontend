import '~/core/i18n/instance';

import { render, screen } from '@testing-library/react';

import { EntityType } from '~/@/entities';
import SchoolConnectivityLayer from '../school-connectivity-layer.view';
import SchoolConnectivityNotification from '../school-connectivity-notification.view';

describe('SchoolConnectivityLayer & SchoolConnectivityNotification', () => {
  it('renders SchoolConnectivityLayer correctly', () => {
    render(<SchoolConnectivityLayer entityType={EntityType.SCHOOL} />);
    expect(screen.getAllByText(/connectivity status/i).length).toBeGreaterThan(0);
  });

  it('renders Priority 1 notification when connectivity status mapped is 0', () => {
    render(
      <SchoolConnectivityNotification
        countryName="Brazil"
        isConnectivityStatusZero={true}
        isLiveButtonDisabled={true}
      />
    );

    expect(
      screen.getByText(/Brazil isn't reporting connectivity status/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/For more information,/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /contact us/i })).toBeInTheDocument();
  });

  it('renders Priority 2 notification when live button is disabled and connectivity status is not 0', () => {
    render(
      <SchoolConnectivityNotification
        countryName="Brazil"
        isConnectivityStatusZero={false}
        isLiveButtonDisabled={true}
      />
    );

    expect(
      screen.getByText(/Brazil isn't reporting internet quality/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Want to help map it\?/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Contact us/i })).toBeInTheDocument();
  });
});
