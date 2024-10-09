import { Api, InformationSquare, WatsonHealthThumbnailPreview } from '@carbon/icons-react';
import { SideNavItems } from '@carbon/react';
import { useStore } from 'effector-react';

import { MenuItem, MenuItemBlank, MobileFooterContainer, SideBarMenuList } from '~/@/common/menu-item-link/menu-item-link.style';
import FooterCommonLogo from '~/@/map/ui/footer-common-logo';
import { $isMobile } from '~/core/media-query';
import { router } from '~/core/routes';

import { onChangeMenu } from '../../sidebar.model';
import { useTranslation } from 'react-i18next';



const SidebarMenuList = () => {
  const { t } = useTranslation();
  const isMobile = useStore($isMobile)

  return (
    <SideBarMenuList>
      <SideNavItems>
        <MenuItemBlank onClick={() => onChangeMenu(false)} href={'/docs/explore-api'} renderIcon={Api} target="_blank">
          {t('api-s-and-download')}
        </MenuItemBlank>
        <MenuItemBlank onClick={() => onChangeMenu(false)} renderIcon={InformationSquare} href={'/about'} target="_blank">
          {t('about-giga-maps')}
        </MenuItemBlank>
        <MenuItem onClick={() => {
          router.navigate(`/map?popover=tour`)
        }} renderIcon={WatsonHealthThumbnailPreview} >
          {t('tour')}
        </MenuItem>
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