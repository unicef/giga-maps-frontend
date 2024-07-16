import { Api, ArrowRight, Logout, UserAdmin, VirtualColumnKey } from '@carbon/icons-react';
import { Button, SideNavItems } from '@carbon/react';
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
import { admin, docsApiKeys, docsExporeApi, mapOverview, router } from '~/core/routes';
import { useRoute } from '~/lib/router';

import UserAvatar from '../../../../common/user-avatar';
import { BorderLine, HamburgerMenu, LoginSignupWrapper, SidePanelWrapper } from './side-menu-panel.style';


const SideMenuPanel = () => {
  const userName = useStore($userFullName);
  const isAdmin = useStore($isAdmin);
  const isLoggedIn = useStore($isLoggedIn);
  const loggedInUser = useStore($loggedInUser);
  const rolesLength = loggedInUser?.role?.permission_slugs?.length || 0;
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
              {!userName &&
                <Button
                  renderIcon={ArrowRight}
                  kind="tertiary"
                  onClick={() => {
                    void onLoginSignup();
                  }}
                >
                  Login/Signup
                </Button>}
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
                    void onLogout()
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