import { fireEvent, render } from '@testing-library/react';
import { testWrapper } from '~/tests/jest-wrapper';
import SidebarMenuList from '../sidebar-menu-list';
import { MenuItemBlank } from '~/@/common/menu-item-link/menu-item-link.style';
import { Api } from '@carbon/icons-react';

describe('Sidebar menu list component', () => {
  it('should render component', () => {
    const { asFragment } = render(testWrapper(<SidebarMenuList />));
    expect(asFragment).toMatchSnapshot();
  });

  it('should render component and handle click', () => {
    const onChangeMenu = jest.fn();
    const { getByText } = render(
      <MenuItemBlank onClick={() => onChangeMenu(false)} href={'/docs/explore-api'} renderIcon={Api} target="_blank">
        API’s and Download
      </MenuItemBlank>
    );

    fireEvent.click(getByText("API’s and Download"));

    expect(onChangeMenu).toHaveBeenCalledTimes(1);

    expect(getByText("API’s and Download")).toBeInTheDocument();
  });
});
