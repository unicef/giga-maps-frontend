import { Api, ArrowRight, Logout, UserAdmin, VirtualColumnKey, Launch } from '@carbon/icons-react';
import { Button, Link, SideNavItems } from '@carbon/react';
import { useStore } from 'effector-react';

import { MenuItem } from '~/@/common/menu-item-link/menu-item-link.style';
import MenuItemLink from '~/@/common/menu-item-link/menu-item-link.view';
import TopMenuBar from '~/@/common/top-menu-bar/top-menu-bar.view';
import { $isMenuOpen, onChangeMenu } from '~/@/sidebar/sidebar.model';
import SidebarMenuList from '~/@/sidebar/ui/common-components/sidebar-menu-list';
import { LogoutButtonWrapper } from '~/core/auth/auth.style';
import { onLoginSignup, onLogout } from '~/core/auth/azure-msal/model';
import { $isAdmin, $isLoggedIn, $loggedInUser, $userFullName } from '~/core/auth/models';
import { AuthCheckWrapper } from '~/core/auth/utils';
import { admin, docsApiKeys, docsExporeApi } from '~/core/routes';
import { useRoute } from '~/lib/router';

import UserAvatar from '../../../../common/user-avatar';
import { BorderLine, HamburgerMenu, LoginSignupWrapper, SidePanelWrapper } from './side-menu-panel.style';
import { Div, Text } from '~/@/common/style/styled-component-style';


const SideMenuPanel = () => {
  const userName = useStore($userFullName);
  const isAdmin = useStore($isAdmin);
  const isLoggedIn = useStore($isLoggedIn);
  const loggedInUser = useStore($loggedInUser);
  const rolesLength = loggedInUser?.role?.permission_slugs?.length ?? 0;
  const exploreApiRoute = useRoute(docsExporeApi);
  const apiKeysRoute = useRoute(docsApiKeys);
  const isMenuOpen = useStore($isMenuOpen);
  return (
    <SidePanelWrapper>
      <HamburgerMenu>
        <TopMenuBar
          isMenuOpen={isMenuOpen}
          onClickMenu={() => onChangeMenu(!isMenuOpen)}
        />
      </HamburgerMenu>
      <>
        {isMenuOpen ? <SidebarMenuList />
          :
          <>
            <LoginSignupWrapper>
              {!userName && <>
                <Button
                  renderIcon={ArrowRight}
                  kind="tertiary"
                  onClick={() => {
                    onLoginSignup();
                  }}
                >
                  Login/Signup
                </Button>
                <Div $style='padding: 0.5rem 0 0 0; font-size: 0.75rem; color: #b8b8b8; line-height: 1.2rem;'>
                  <Text>By signing up, you agree to allow Giga to: </Text>
                  <ul style={{ 'list-style': 'outside disc', 'padding-left': '1.2rem' }}>
                    <li style={{ paddingBlock: '0.3rem' }}>Store and use your email for authentication.</li>
                    <li>Send you communications about the Giga data and API portal.</li>
                  </ul>
                  <Div $margin='1rem 0 0 0;'>
                    <Link size="sm" href='https://www.unicef.org/legal#privacy-policy' target="_blank">View UNICEF's Privacy Policy &nbsp;<Launch /></Link>
                  </Div>
                </Div>
              </>}
              {userName && <UserAvatar userName={userName} />}

            </LoginSignupWrapper >
            <BorderLine />
            <SideNavItems>
              <MenuItemLink to={docsExporeApi} isActive={exploreApiRoute} icon={Api} id='explore-api'>
                Explore API’s
              </MenuItemLink>
              {isLoggedIn ? <MenuItemLink to={docsApiKeys} isActive={apiKeysRoute} icon={VirtualColumnKey} id='api-keys' >
                API Keys
              </MenuItemLink > :
                <MenuItem onClick={AuthCheckWrapper(() => { })} renderIcon={VirtualColumnKey} id='api-keys' >
                  API Keys
                </MenuItem>
              }
              {(isAdmin && rolesLength > 0) &&
                < MenuItemLink to={admin} icon={UserAdmin} >
                  Admin
                </MenuItemLink>
              }
            </SideNavItems>
            {
              isLoggedIn && <LogoutButtonWrapper>
                <Button
                  renderIcon={Logout}
                  kind="ghost"
                  onClick={() => {
                    docsExporeApi.navigate()
                    onLogout()
                  }}
                >
                  Logout
                </Button>
              </LogoutButtonWrapper>
            }
          </>}
      </>
    </SidePanelWrapper >
  )
}

export default SideMenuPanel;