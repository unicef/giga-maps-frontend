import { useStore } from "effector-react";
import EditFilterList from "../edit-filter.view";
import { render } from "@testing-library/react";
import { adminFilterRoute, editAdminFilter, router } from "~/core/routes";
import { getFilterListIdFx } from "~/@/admin/effects/filter-fx";
import { fetchMockResponse } from "~/tests/fetchMock";

describe('EditFilterList', () => {
  beforeEach(() => {
    fetchMock.mockResponse(fetchMockResponse)
  })

  it('should navigate to adminFilterRoute if id is not provided', () => {
    editAdminFilter.navigate({ id: 0 })
    const { asFragment } = render(<EditFilterList />);

    expect(asFragment()).toMatchSnapshot();
  });

  it('should call getFilterListIdFx with id when id is provided', () => {
    editAdminFilter.navigate({ id: 1 })
    const { asFragment } = render(<EditFilterList />);
    expect(asFragment()).toMatchSnapshot();
  });

});