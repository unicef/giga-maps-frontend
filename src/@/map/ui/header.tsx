import React from 'react';

import SideInfoPanelHeaderLogoAndMenuButton from '../../sidebar/ui/common-components/side-info-panel-header-menubutton-and-logo';

const Header = () => (
  <header className="header">
    <div className="container-fluid">
      {/* <Logo />
      <Link to={about} className="header__button button button--primary">
        Project info
      </Link> */}
      <SideInfoPanelHeaderLogoAndMenuButton />

    </div>
  </header>
);

export default Header;
