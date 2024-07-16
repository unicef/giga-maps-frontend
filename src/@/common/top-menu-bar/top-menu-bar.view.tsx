import { Close, Menu, Search } from '@carbon/icons-react';
import { IconButton } from '@carbon/react';

import { mapOverview } from '~/core/routes';

import { HamburgerWrapper, LogoName, TopMenuWrapper } from './top-menu-bar.style';
import logo from '~/assets/images/giga-logo.png';
import whiteLogo from '~/assets/images/white-logo-small.png';
import { $theme, ThemeType } from '~/core/theme.model';
import { useStore } from 'effector-react';

const TopMenuBar = ({
  isMenuOpen = false,
  onClickMenu = () => { }
}: { isMenuOpen?: boolean; onClickMenu?: () => void; }) => {
  const isLight = useStore($theme) === ThemeType.light;
  return (
    <HamburgerWrapper>
      <TopMenuWrapper>
        <IconButton
          label={isMenuOpen ? "Close" : "Menu"}
          onClick={() => {
            onClickMenu();
          }}
          size="lg"
          align="bottom"
          iconDescription='Menu Icon'
          kind="ghost"
          className="sidebar-menuIcon"
        >
          {isMenuOpen ? <Close size={20} /> : <Menu size={20} />}
        </IconButton>
        <LogoName to={mapOverview}>
          <img src={isLight ? whiteLogo : logo} alt="Giga logo" />
        </LogoName>
      </TopMenuWrapper>
    </HamburgerWrapper >
  )
}

export default TopMenuBar;
