import { useStore } from 'effector-react';

import TopMenuBar from '~/@/common/top-menu-bar/top-menu-bar.view';

import { $isMenuOpen, onChangeMenu } from '~/@/sidebar/sidebar.model';

const SideInfoPanelHeaderMenuButtonAndLogo = () => {
  const isMenuOpen = useStore($isMenuOpen);

  return (
    <TopMenuBar
      isMenuOpen={isMenuOpen}
      onClickMenu={() => onChangeMenu(!isMenuOpen)}
    />
  )
}

export default SideInfoPanelHeaderMenuButtonAndLogo
