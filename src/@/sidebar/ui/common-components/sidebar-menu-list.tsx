import { Api, InformationSquare, WatsonHealthThumbnailPreview } from '@carbon/icons-react';
import { Dropdown, SideNavItems } from '@carbon/react';
import { useStore } from 'effector-react';

import { MenuItem, MenuItemBlank, MobileFooterContainer, SideBarMenuList } from '~/@/common/menu-item-link/menu-item-link.style';
import FooterCommonLogo from '~/@/map/ui/footer-common-logo';
import { $isMobile } from '~/core/media-query';
import { router } from '~/core/routes';

import { onChangeMenu } from '../../sidebar.model';
import { useTranslation } from 'react-i18next';
import { languages } from '~/core/i18n/constant';
import styled from 'styled-components';
import { $SelectedLngObj, onLanguageChange } from '~/core/i18n/store';

const LanguageDropdown = styled(Dropdown)`
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 0.5rem 1rem;
  .cds--list-box__field{
    background: ${props => props.theme.grey80};
  }

  .cds--list-box__label{
    color: ${props => props.theme.filterGrey};
  }

  .cds--list-box__menu-icon{
    svg{
      fill:${props => props.theme.text};
    }
  }
  
  // Style for the titleText
  .cds--list-box__label {
    color: ${props => props.theme.filterText}; 
  }

  .cds--label{
    color: ${props => props.theme.filterGrey}
  }

  .cds--list-box__menu{
    background: ${props => props.theme.grey80};
  }

  .cds--list-box__menu-item__option{
    color: ${props => props.theme.filterGrey}
  }

  .cds--list-box__menu-item--active .cds--list-box__menu-item__option {
    background: ${props => props.theme.grey90};
    color: #222;
  }
`

const SidebarMenuList = () => {
  const { t } = useTranslation();
  const isMobile = useStore($isMobile)
  const selectedLngObj = useStore($SelectedLngObj)
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
      <LanguageDropdown
        id="language"
        direction="bottom"
        titleText=""
        selectedItem={selectedLngObj}
        items={languages}
        itemToString={item => item ? item.name : ''}
        onChange={({ selectedItem }) => {
          console.log(selectedItem);
          onLanguageChange(selectedItem.code)
        }}
      />
      {
        isMobile &&
        <MobileFooterContainer>
          <FooterCommonLogo />
        </MobileFooterContainer>
      }
    </SideBarMenuList>

  )
}

export default SidebarMenuList