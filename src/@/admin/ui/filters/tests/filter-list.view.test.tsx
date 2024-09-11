import { render } from "@testing-library/react";
import { testWrapper } from "~/tests/jest-wrapper";
import ListFilterView from "../filter-list.view";
import AddFilterList from "../add-filter.view";
import AdminFilters from "..";

describe('User role', () => {
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
});