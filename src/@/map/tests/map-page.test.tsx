import { render } from "@testing-library/react"

import { onChangeTourStartPopup } from "~/@/product-tour/models/product-tour.model"
import { testWrapper } from "~/tests/jest-wrapper"

import MapPage from "../ui/map-page"

describe("Render Map-page", () => {
  test("MapPage", () => {
    render(testWrapper(<MapPage />))
  })
})