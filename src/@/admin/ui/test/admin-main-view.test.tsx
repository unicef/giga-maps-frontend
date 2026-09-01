import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createEvent } from 'effector';

import { $admin1Code } from '~/@/country/country.model';
import { $loggedInUser } from '~/core/auth/models';
import { loggedInUser, userList } from '~/tests/data/admin-main-data';
import { userDetails } from '~/core/routes';
import { testWrapper } from '~/tests/test-wrapper';

import { $userListResponse } from '../../models/user-management.model';
import AdminPanelMainComponent from '../main/admin-main.view';
import AdminPanelTabs from '../main/admin-panel-tabs';
import UserDetailsComponent from '../user-crud/user-detail.view';
import UserListComponent from '../user-crud/user-list.view';
import { createEffect } from 'effector';
import { getUserByIdFx, updateUserFx } from '../../effects/user-management-fx';

vi.mock('../../effects/user-management-fx', async () => {
  const { createEffect } = await vi.importActual('effector');
  return {
    getAllUserListFx: createEffect(() => Promise.resolve({ results: [], count: 0 })),
    getUserByIdFx: createEffect(() => Promise.resolve({ first_name: 'Admin', last_name: 'User', role: { id: 1, name: 'Admin' }, is_active: true })),
    updateUserFx: createEffect(() => Promise.resolve({ first_name: 'Admin', last_name: 'User', role: { id: 1, name: 'Admin' }, is_active: true })),
    getRolesListFx: createEffect(() => Promise.resolve({ results: [], count: 0 })),
    getRoleByIdFx: createEffect(() => Promise.resolve({})),
    deleteRoleFx: createEffect(() => Promise.resolve({})),
    createRoleFx: createEffect(() => Promise.resolve({})),
    updateRoleFx: createEffect(() => Promise.resolve({})),
  };
});


const setLoggedInUser = createEvent();
$loggedInUser.on(setLoggedInUser, (_, payload) => payload);

export const setAdmin1 = createEvent();
$admin1Code.on(setAdmin1, (_, payload) => payload)

const setUserList = createEvent();
$userListResponse.on(setUserList, (_, payload) => payload)

describe('AdminPanelMainComponent', () => {
  test('renders AdminPanelTabs and take a snapshop', () => {
    setLoggedInUser(loggedInUser);
    const { asFragment } = render(
      testWrapper(<AdminPanelTabs />)
    );
    expect(asFragment()).toMatchSnapshot();
  });
  test('click on Invaliadte cache', async () => {
    setLoggedInUser(loggedInUser);
    const handleClick = vi.fn();
    const { getByTestId } = render(<AdminPanelTabs onClick={handleClick} />);
    const button = getByTestId('invalidate-cache');
    fireEvent.click(button);
    await waitFor(() => {
      expect(handleClick).toHaveBeenCalledTimes(1);
    })
  });
})
describe('AdminPanelMainComponent', () => {
  test('renders AdminPanelMainComponent and take a snapshop', () => {
    setAdmin1('AF')
    const { asFragment } = render(
      testWrapper(<AdminPanelMainComponent />)
    );
    expect(asFragment()).toMatchSnapshot();
  });

  test('render UserListComponent by click on tab', () => {
    const handleClick = vi.fn();
    const { getByTestId } = render(<AdminPanelTabs onClick={handleClick} />);
    const button = getByTestId('admin-user-list');
    fireEvent.click(button);
    render(testWrapper(<AdminPanelMainComponent />))
    expect(screen.getByText('List of users')).toBeInTheDocument();
  })

  test('render UserDetailsComponent by click on tab', () => {
    setUserList(userList)
    const handleClick = vi.fn();
    const { getByTestId } = render(<UserListComponent onClick={handleClick} />);
    const button = getByTestId('admin-user-details');
    fireEvent.click(button);
    render(testWrapper(<AdminPanelMainComponent />))
    expect(screen.getByText('Details for user')).toBeInTheDocument();
  })

  test("submit user detaisl", async () => {
    userDetails.navigate({ userId: 1 });
    const { getByTestId } = render(testWrapper(<AdminPanelMainComponent />));
    const button = getByTestId('submit-admin-user-details');
    fireEvent.click(button);
    await waitFor(() => {
      expect(screen.getByText('List of users')).toBeInTheDocument();
    })
  })

  test('render RolesList by click on tab', () => {
    const handleClick = vi.fn();
    const { getByTestId } = render(<AdminPanelTabs onClick={handleClick} />);
    const button = getByTestId('admin-roles-list');
    fireEvent.click(button);
    render(testWrapper(<AdminPanelMainComponent />))
    expect(screen.getByText('List of user roles')).toBeInTheDocument();
  })

  // test('render AdminApiKey by click on tab', () => {
  //   const handleClick = vi.fn();
  //   const { getByTestId } = render(<AdminPanelTabs onClick={handleClick} />);
  //   const button = getByTestId('admin-api-key-request-list');
  //   fireEvent.click(button);
  //   render(testWrapper(<AdminPanelMainComponent />))
  //   expect(screen.getByText('Api Keys Requests')).toBeInTheDocument();
  // })
})


