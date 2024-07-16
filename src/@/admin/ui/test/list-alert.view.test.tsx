import { render } from "@testing-library/react"

import { testWrapper } from "~/tests/jest-wrapper"

import ListAlertView from "../alerts/list-alert.view"

describe("ListAlertView", () => {
  test("Render ListAlertView", () => {
    const { asFragment } = render(testWrapper(<ListAlertView />))
    expect(asFragment()).toMatchSnapshot();
  })
})
