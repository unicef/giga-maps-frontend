import { fireEvent, render } from "@testing-library/react"

import { testWrapper } from "~/tests/jest-wrapper"

import MainAboutUsView from "../about-us/main-about-us.view"
import aboutusData from "~/tests/data/aboutus-data"

describe("About Us", () => {
  beforeEach(() => {
    fetchMock.mockResponse((req) => {
      if (req.url.includes('about_us/about_us/')) {
        return Promise.resolve(JSON.stringify(aboutusData))
      } else {
        return Promise.resolve(JSON.stringify(null))
      }
    });
  })
  test("Render MainAboutUsView", () => {
    const { asFragment } = render(testWrapper(<MainAboutUsView />))
    expect(asFragment()).toMatchSnapshot();
  })

  test("MainForm submit", async () => {
    const { findByTestId } = render(testWrapper(<MainAboutUsView />))
    const form = await findByTestId('admin-about-us-form')
    if (form) {
      await fireEvent.submit(form)
    }
    expect(form).not.toBeNull()
  })
})

