import { Close, Menu } from '@carbon/icons-react';
import { IconButton } from '@carbon/react';

import { mapOverview } from '~/core/routes';

import { HamburgerWrapper, LogoName, TopMenuWrapper } from './top-menu-bar.style';

const TopMenuBar = ({
  isMenuOpen = false,
  onClickMenu = () => { }
}: { isMenuOpen?: boolean; onClickMenu?: () => void; }) => {
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
          ATLAS
        </LogoName>
      </TopMenuWrapper>
    </HamburgerWrapper >
  )
}

export default TopMenuBar;
