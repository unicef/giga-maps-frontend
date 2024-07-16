
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { createEvent } from "effector";

import { $admin1Code } from "~/@/country/country.model";
import { $loggedInUser } from "~/core/auth/models";
import { loggedInUser } from "~/tests/data/admin-main-data";
import { mockedRoleListResponse } from "~/tests/data/admin-role-data";
import { testWrapper } from '~/tests/jest-wrapper';

import { $roleListResponse } from "../../models/user-management.model";
import CreateRole from "../roles-crud/create-role.view";
import EditRole from "../roles-crud/edit-role.view";
import RolesList from "../roles-crud/user-roles-list.view";


const setRoleListResponse = createEvent();
$roleListResponse.on(setRoleListResponse, (_, payload) => payload)

const setAdmin1 = createEvent();
$admin1Code.on(setAdmin1, (_, payload) => payload)

const setLoggedInUser = createEvent();
$loggedInUser.on(setLoggedInUser, (_, payload) => payload);


describe("RoleList", () => {
  test("render RolesList and take snapshot", () => {
    const { asFragment } = render(
      testWrapper(<RolesList />)
    );
    expect(asFragment()).toMatchSnapshot();
  })

  it('renders roles list correctly', async () => {
    setRoleListResponse(mockedRoleListResponse)
    render(
      testWrapper(<RolesList />)
    );
    expect(screen.getByText('Admin')).toBeInTheDocument()
  });

  it('render RoleEidt by click', () => {
    setLoggedInUser(loggedInUser);
    setAdmin1('AF')
    setRoleListResponse(mockedRoleListResponse)
    const handleClick = jest.fn();
    const { getByTestId } = render(testWrapper(<RolesList onClick={handleClick} />));
    const button = getByTestId('admin-role-edit');
    fireEvent.click(button);
    const { asFragment } = render(
      testWrapper(<EditRole />)
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('render CreateRole by click', () => {
    const { asFragment } = render(
      testWrapper(<CreateRole />)
    );
    expect(asFragment()).toMatchSnapshot();
    expect(screen.getByText('Create Role')).toBeInTheDocument();
  });
})

