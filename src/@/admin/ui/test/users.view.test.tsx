import { render } from "@testing-library/react"

import { testWrapper } from '~/tests/jest-wrapper';

import UserListComponent from "../user-crud/user-list.view"
import UserPermissionComponent from "../user-permission/list-user-permission";


describe('UserDetailsComponent', () => {
  test("render UserListComponent and take snapshot", () => {
    const { asFragment } = render(
      testWrapper(<UserListComponent />)
    );
    expect(asFragment()).toMatchSnapshot();
  })

  test("Render UserPermissionComponent", () => {
    const { asFragment } = render(<UserPermissionComponent />)
    expect(asFragment()).toMatchSnapshot();
  })
})