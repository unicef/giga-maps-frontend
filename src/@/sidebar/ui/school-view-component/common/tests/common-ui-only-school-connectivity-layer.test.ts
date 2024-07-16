import React from 'react';
import { render } from '@testing-library/react';
import { testWrapper } from '~/tests/jest-wrapper';
import CommonUIOnlySchoolConnectivityLayer from '../common-ui-only-school-connectivity-layer';

describe('CommonUIOnlySchoolConnectivityLayer component', () => {
  it('should render without crashing', () => {
    const component = render(testWrapper(<CommonUIOnlySchoolConnectivityLayer schoolId={ 1} />));
    const componentText = component.asFragment();
    expect(componentText).toMatchSnapshot();
  });
});