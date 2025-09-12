import { fireEvent, getByRole, render, waitFor } from "@testing-library/react";
import { testWrapper } from "~/tests/jest-wrapper";
import ListFilterView from "../filter-list.view";
import AddFilterList from "../add-filter.view";
import AdminFilters from "..";
import { adminFilterRoute } from "~/core/routes";
import { deleteFilterFx, getFilterListFx, publishFilterFx } from "~/@/admin/effects/filter-fx";
import { before } from "node:test";
import { fetchMockResponse } from "~/tests/fetchMock";

describe('Admin Filter', () => {

  beforeEach(() => {
    fetchMock.mockResponse(fetchMockResponse)
  })
  it('should render component', () => {
    const { asFragment } = render(testWrapper(<ListFilterView />));
    expect(asFragment).toMatchSnapshot();
  });

  it('should render component', () => {
    const { asFragment } = render(testWrapper(<AddFilterList />));
    expect(asFragment).toMatchSnapshot();
  });

  it('should render component', () => {
    const { asFragment } = render(testWrapper(<AdminFilters />));
    expect(asFragment).toMatchSnapshot();
  });

  it('should handle search value changes', async () => {
    adminFilterRoute.navigate();
    const { getByPlaceholderText } = render(testWrapper(<ListFilterView />));
    const searchInput = getByPlaceholderText('Filter by name, type');
    fireEvent.change(searchInput, { target: { value: 'test search' } });
    expect(searchInput.value).toBe('test search');
  });

});