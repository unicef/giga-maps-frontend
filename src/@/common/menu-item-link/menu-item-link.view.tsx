import { PropsWithChildren } from 'react';

import { setTheme } from '~/core/theme.model';
import { Link } from '~/lib/router';
import { Route } from '~/lib/router/types';

import { MenuItem } from './menu-item-link.style';

const MenuItemLink = ({ icon, children, to, isActive, id }: PropsWithChildren<{ icon: any; to: Route, isActive?: boolean; id?: string }>) => {

  return (
    <Link to={to} id={id}>
      <MenuItem renderIcon={icon} $active={isActive}>
        {children}
      </MenuItem>
    </Link>
  )
}

export default MenuItemLink