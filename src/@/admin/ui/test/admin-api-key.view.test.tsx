import { fireEvent, render, } from "@testing-library/react"
import { createEvent } from "effector";

import { $apiRequestListResponse } from "../../models/api-request-model";
import AdminApiKey from "../admin-api-keys/admin-api-key.view";
import { testWrapper } from "~/tests/jest-wrapper";
import adminApiKeyListData from '~/tests/data/admin-api-key-list';

const setApiRequestResonse = createEvent();
$apiRequestListResponse.on(setApiRequestResonse, (_, payload) => payload)

describe("AdminApiKey", () => {
  test("render AdminApiKey", () => {
    setApiRequestResonse(adminApiKeyListData)
    const { asFragment } = render(
      testWrapper(<AdminApiKey />)
    );
    expect(asFragment()).toMatchSnapshot();
  })
  test("render with empty AdminApiKey", () => {
    setApiRequestResonse({})
    const { asFragment } = render(
      testWrapper(<AdminApiKey />)
    );
    expect(asFragment()).toMatchSnapshot();
  })
  // test("click on refresh to refrash list", () => {
  //   const { getByTestId } = render(testWrapper(<AdminApiKey />));
  //   const button = getByTestId('refresh-list');
  //   fireEvent.click(button);
  // })

})