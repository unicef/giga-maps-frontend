

import { render } from "@testing-library/react"

import { testWrapper } from "~/tests/jest-wrapper"

import Actionable from "../common/Actionable.view"

describe("ActionableNotification", () => {
  test("render ActionableNotification", () => {
    render(testWrapper(<Actionable onClose={""} onAction={""} title={""} />))
  })
})