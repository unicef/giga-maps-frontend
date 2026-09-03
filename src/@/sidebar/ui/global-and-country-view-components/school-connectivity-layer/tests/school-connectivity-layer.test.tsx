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
        entityType={EntityType.SCHOOL}
      />
    );

    expect(
      screen.getByText(/School connectivity status is unknown for Brazil/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        (_, el) => el?.textContent?.trim() === 'Contact us for more information.'
      )
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /contact us/i })).toBeInTheDocument();
  });

  it('renders unknown connectivity status notification for health facilities in United Republic of Tanzania', () => {
    render(
      <SchoolConnectivityNotification
        countryName="United Republic of Tanzania"
        isConnectivityStatusZero={true}
        isLiveButtonDisabled={true}
        entityType={EntityType.HEALTH}
      />
    );

    expect(
      screen.getByText(
        /Health facility connectivity status is unknown for United Republic of Tanzania/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        (_, el) => el?.textContent?.trim() === 'Contact us for more information.'
      )
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /contact us/i })).toBeInTheDocument();
  });

  it('renders Priority 2 notification when live button is disabled and connectivity status is not 0', () => {
    render(
      <SchoolConnectivityNotification
        countryName="Brazil"
        isConnectivityStatusZero={false}
        isLiveButtonDisabled={true}
        entityType={EntityType.SCHOOL}
      />
    );

    expect(
      screen.getByText(/School internet quality is unknown for Brazil/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        (_, el) => el?.textContent?.trim() === 'Contact us for more information.'
      )
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /contact us/i })).toBeInTheDocument();
  });

  it('renders unknown internet quality notification for health facilities in United Republic of Tanzania', () => {
    render(
      <SchoolConnectivityNotification
        countryName="United Republic of Tanzania"
        isConnectivityStatusZero={false}
        isLiveButtonDisabled={true}
        entityType={EntityType.HEALTH}
      />
    );

    expect(
      screen.getByText(
        /Health facility internet quality is unknown for United Republic of Tanzania/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        (_, el) => el?.textContent?.trim() === 'Contact us for more information.'
      )
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /contact us/i })).toBeInTheDocument();
  });
});
