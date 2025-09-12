import { act, render } from "@testing-library/react"

import { testWrapper } from "~/tests/jest-wrapper"

import MapPage from "../ui/map-page"
import { mapCountry, router } from "~/core/routes"
import { $isProductTour, $isTimeplayer, onSelectMainLayer, onToggleTimeplayer } from "~/@/sidebar/sidebar.model"
import "~/core/i18n/instance"
import { getSchoolAvailableDates } from "~/@/sidebar/effects/search-country-fx"
import { fetchLayerListFx } from "~/api/project-connect"
import { fetchMockResponse } from "~/tests/fetchMock"

describe("Render Map-page", () => {
  beforeEach(() => {
    fetchMock.mockResponse(fetchMockResponse)
  });

  test("MapPage snapshot", () => {
    const { asFragment } = render(testWrapper(<MapPage />))
    expect(asFragment()).toMatchSnapshot()
  })

  test("should render with country code", () => {
    mapCountry.navigate({ code: "BR" });
    render(testWrapper(<MapPage />));
  });

  test("should render with product tour", () => {
    router.navigate('/map?popover=tour');
    render(testWrapper(<MapPage />));
    expect($isProductTour.getState()).toBe(true);
  });

  test("should render with timeplayer", async () => {
    mapCountry.navigate({ code: 'AR' });
    await fetchLayerListFx();
    // await onSelectMainLayer(5);
    await getSchoolAvailableDates({ query: "" });
    onToggleTimeplayer(true);
    render(testWrapper(<MapPage />));
    expect($isTimeplayer.getState()).toBe(true);
  });

  // test("should render without optional components", () => {
  //   jest.spyOn(require("effector-react"), "useStore").mockImplementation((store) => {
  //     if (store === mapCountry.params) return { code: "" };
  //     if (store === $isProductTour) return false;
  //     if (store === $isTimeplayer) return false;
  //     return undefined;
  //   });

  //   const { queryByTestId } = render(testWrapper(<MapPage />));
  //   expect(queryByTestId("product-tour")).not.toBeInTheDocument();
  //   expect(queryByTestId("timeplayer-container")).not.toBeInTheDocument();
  // });
})