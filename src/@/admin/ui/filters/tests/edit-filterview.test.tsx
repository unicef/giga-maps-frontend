import { useStore } from "effector-react";
import EditFilterList from "../edit-filter.view";
import { render } from "@testing-library/react";
import { adminFilterRoute, router } from "~/core/routes";
import { getFilterListIdFx } from "~/@/admin/effects/filter-fx";

jest.mock('effector-react', () => ({
  useStore: jest.fn(),
}));

describe('EditFilterList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should navigate to adminFilterRoute if id is not provided', () => {
    router.navigate('/edit');
    (useStore as jest.Mock).mockReturnValue({ id: null });

    render(<EditFilterList />);

    expect(adminFilterRoute.navigate).toHaveBeenCalled();
    expect(getFilterListIdFx).not.toHaveBeenCalled();
  });
  it('should call getFilterListIdFx with id when id is provided', () => {
    const mockId = 1;
    (useStore as jest.Mock).mockReturnValue({ id: mockId });

    render(<EditFilterList />);

    expect(getFilterListIdFx).toHaveBeenCalledWith({ id: mockId });

    expect(adminFilterRoute.navigate).not.toHaveBeenCalled();
  });
});