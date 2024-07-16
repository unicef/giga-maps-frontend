import { fireEvent, render, screen } from "@testing-library/react"

import { testWrapper } from "~/tests/jest-wrapper"

import { onChangeTourEndPopup, onChangeTourStarted, onChangeTourStartPopup } from "../models/product-tour.model"
import ProductTourStartPopup from "../ui/components/modal/product-tour-start-popup"
import ProductTourMainView from "../ui/pages/product-tour-main.view"
import ProductTour from "../ui/product-tour.view"

describe("Product Tour ", () => {
  test("Render ProductTour start", () => {
    onChangeTourStartPopup(true)
    onChangeTourStarted(false)
    onChangeTourEndPopup(false)
    render(testWrapper(<ProductTour />))
  })
  test("Render ProductTour steps", () => {
    onChangeTourStartPopup(false)
    onChangeTourStarted(true)
    onChangeTourEndPopup(false)
    const { container } = render(testWrapper(<ProductTourStartPopup open={true} setOpen={jest.fn()} />))
    const startButton = container.querySelector("#tour-start")
    fireEvent.click(startButton)
    render(testWrapper(<ProductTourMainView />))
  })
  test("Render ProductTour last step", () => {
    onChangeTourStartPopup(false)
    onChangeTourStarted(false)
    onChangeTourEndPopup(true)
    render(testWrapper(<ProductTour />))
  })
})