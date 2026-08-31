import { render } from '@testing-library/react';
import { testWrapper } from '~/tests/test-wrapper';
import RolesList from '../user-roles-list.view';

describe('User role', () => {
  it('should render component', () => {
    const { asFragment } = render(testWrapper(<RolesList />));
    expect(asFragment).toMatchSnapshot();
  });
});

