import { describe, test, } from '@jest/globals';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createEvent } from 'effector';

import { $admin1Code } from '~/@/country/country.model';
import { $loggedInUser } from '~/core/auth/models';
import { loggedInUser, userList } from '~/tests/data/admin-main-data';
import { testWrapper } from '~/tests/jest-wrapper';

import { $userListResponse } from '../../models/user-management.model';
import AdminPanelMainComponent from '../main/admin-main.view';
import AdminPanelTabs from '../main/admin-panel-tabs';
import UserDetailsComponent from '../user-crud/user-detail.view';
import UserListComponent from '../user-crud/user-list.view';


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
  test('click on Invaliadte cache', () => {
    setLoggedInUser(loggedInUser);
    const handleClick = jest.fn();
    const { getByTestId } = render(<AdminPanelTabs onClick={handleClick} />);
    const button = getByTestId('invalidate-cache');
    fireEvent.click(button);
    void waitFor(() => {
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
    const handleClick = jest.fn();
    const { getByTestId } = render(<AdminPanelTabs onClick={handleClick} />);
    const button = getByTestId('admin-user-list');
    fireEvent.click(button);
    render(testWrapper(<AdminPanelMainComponent />))
    expect(screen.getByText('List of users')).toBeInTheDocument();
  })

  test('render UserDetailsComponent by click on tab', () => {
    setUserList(userList)
    const handleClick = jest.fn();
    const { getByTestId } = render(<UserListComponent onClick={handleClick} />);
    const button = getByTestId('admin-user-details');
    fireEvent.click(button);
    render(testWrapper(<AdminPanelMainComponent />))
    expect(screen.getByText('Details for user')).toBeInTheDocument();
  })

  test("submit user detaisl", () => {
    const handleClick = jest.fn();
    const { getByTestId } = render(<UserDetailsComponent onClick={handleClick} />);
    const button = getByTestId('submit-admin-user-details');
    fireEvent.click(button);
    void waitFor(() => {
      expect(screen.getByText('List of users')).toBeInTheDocument();
    })
  })

  test('render RolesList by click on tab', () => {
    const handleClick = jest.fn();
    const { getByTestId } = render(<AdminPanelTabs onClick={handleClick} />);
    const button = getByTestId('admin-roles-list');
    fireEvent.click(button);
    render(testWrapper(<AdminPanelMainComponent />))
    expect(screen.getByText('List of user roles')).toBeInTheDocument();
  })

  // test('render AdminApiKey by click on tab', () => {
  //   const handleClick = jest.fn();
  //   const { getByTestId } = render(<AdminPanelTabs onClick={handleClick} />);
  //   const button = getByTestId('admin-api-key-request-list');
  //   fireEvent.click(button);
  //   render(testWrapper(<AdminPanelMainComponent />))
  //   expect(screen.getByText('Api Keys Requests')).toBeInTheDocument();
  // })
})