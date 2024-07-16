import { Api, InformationSquare, ProgressBar, WatsonHealthThumbnailPreview } from '@carbon/icons-react';
import { SideNavItems } from '@carbon/react';
import { useStore } from 'effector-react';

import { MenuItem, MenuItemBlank, MobileFooterContainer, SideBarMenuList } from '~/@/common/menu-item-link/menu-item-link.style';
import FooterCommonLogo from '~/@/map/ui/footer-common-logo';
import { $isMobile } from '~/core/media-query';
import { router } from '~/core/routes';

import { onChangeMenu } from '../../sidebar.model';



const SidebarMenuList = () => {
  const isMobile = useStore($isMobile)

  return (
    <SideBarMenuList>
      <SideNavItems>
        <MenuItemBlank onClick={() => onChangeMenu(false)} href={'/docs/explore-api'} renderIcon={Api} target="_blank">
          API’s and Download
        </MenuItemBlank>
        <MenuItemBlank onClick={() => onChangeMenu(false)} renderIcon={InformationSquare} href={'/about'} target="_blank">
          About Giga maps
        </MenuItemBlank>
        <MenuItem onClick={() => {
          router.navigate(`/map?popover=tour`)
        }} renderIcon={WatsonHealthThumbnailPreview} >
          Tour
        </MenuItem>
        {/* <MenuItemBlank onClick={() => onChangeMenu(false)} renderIcon={ProgressBar} href={'https://projectconnect.unicef.org/country-progress'} target="_blank">
          Country progress dashboard
        </MenuItemBlank> */}
      </SideNavItems>
      {
        isMobile &&
        <MobileFooterContainer className='hello'>
          <FooterCommonLogo />
        </MobileFooterContainer>
      }
    </SideBarMenuList>

  )
}

export default SidebarMenuList