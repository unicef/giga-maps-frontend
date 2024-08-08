import { Building, ContentView, DataBase, Earth, Email, Filter, Layers, Logout, RecentlyViewed, Result, UserMultiple, VirtualColumnKey } from '@carbon/icons-react';
import { Button, SideNavItems } from '@carbon/react';
import { useStore } from 'effector-react';
import { useState } from 'react';

import MenuItemLink from '~/@/common/menu-item-link';
import { LogoutButtonWrapper } from '~/core/auth/auth.style';
import { onLogout } from '~/core/auth/azure-msal/model';
import { $isAdminUser, $userPermissions } from '~/core/auth/models';
import { adminAboutUs, adminApiKeys, adminCountry, adminFilterRoute, adminGigaLayer, adminSchools, backgroundTask, contactMessage, dataSource, docsExporeApi, recentActions, userList, userRoles } from '~/core/routes';
import { Link } from '~/lib/router';

import { getInvalidateCacheFx } from '../../effects/admin-main-fx';
import { AdminSideNavMenu, AdminSubSingleTab, InvalidateCacheWrapper, SideBarScrollContainer, SideBarTabsContainer } from '../styles/admin-styles'
import InvalidatCacheModal from './Invalidate-cache-modal';

const AdminPanelTabs = () => {
  const permissions = useStore($userPermissions);
  const isAdminUser = useStore($isAdminUser);
  const [invalidateCache, setInvalidateCache] = useState(false)

  const callInvalidateCache = async () => {
    try {
      await getInvalidateCacheFx()
      setInvalidateCache(true)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      <SideBarScrollContainer>
        <SideBarTabsContainer>
          <SideNavItems>
            {permissions.CAN_VIEW_DATA_LAYER &&
              <MenuItemLink to={adminGigaLayer} icon={Layers}>
                Giga layers
              </MenuItemLink>
            }
            {permissions.CAN_VIEW_ADVANCE_FILTER && <MenuItemLink to={adminFilterRoute} icon={Filter}>
              Filters
            </MenuItemLink>}
            {(permissions.CAN_VIEW_ALL_ROLES || permissions.CAN_VIEW_USER) &&
              <AdminSideNavMenu
                title="User Management"
                renderIcon={UserMultiple}
              >
                {permissions.CAN_VIEW_USER &&
                  <Link to={userList} data-testid="admin-user-list">
                    <AdminSubSingleTab >
                      User
                    </AdminSubSingleTab>
                  </Link>
                }
                {permissions.CAN_VIEW_ALL_ROLES &&
                  <Link to={userRoles} data-testid="admin-roles-list">
                    <AdminSubSingleTab >
                      Roles
                    </AdminSubSingleTab>
                  </Link>
                }
              </AdminSideNavMenu>}
            {permissions.CAN_APPROVE_REJECT_API_KEY &&
              <MenuItemLink to={adminApiKeys} icon={VirtualColumnKey}>
                Api Key Request
              </MenuItemLink>
            }
            {permissions.CAN_VIEW_SCHOOL_MASTER_DATA &&
              <MenuItemLink to={dataSource} icon={DataBase} >
                Schools Master data
              </MenuItemLink>
            }
            {isAdminUser &&
              <MenuItemLink to={adminAboutUs} icon={ContentView} >
                About us
              </MenuItemLink>
            }
            {(permissions.CAN_VIEW_SCHOOL) &&
              <MenuItemLink to={adminSchools} icon={Building} >
                School(s)
              </MenuItemLink>
            }
            {(permissions.CAN_VIEW_COUNTRY) &&
              <MenuItemLink to={adminCountry} icon={Earth} >
                Country(s)
              </MenuItemLink>
            }
            {(permissions.CAN_VIEW_BACKGROUND_TASK) &&
              <MenuItemLink to={backgroundTask} icon={Result}>
                Background Task
              </MenuItemLink>
            }
            {(permissions.CAN_VIEW_CONTACT_MESSAGE) &&
              <MenuItemLink to={contactMessage} icon={Email}>
                Contact message
              </MenuItemLink>
            }
            {(permissions.CAN_VIEW_RECENT_ACTIONS) &&
              <MenuItemLink to={recentActions} icon={RecentlyViewed}>
                Recent actions
              </MenuItemLink>
            }
          </SideNavItems>
          {isAdminUser && <>
            <InvalidateCacheWrapper>
              <Button
                data-testid="invalidate-cache"
                kind='ghost'
                onClick={() => {
                  void callInvalidateCache()

                }}
              >Invalidate Cache</Button>
            </InvalidateCacheWrapper>
            <InvalidatCacheModal open={invalidateCache} setOpen={setInvalidateCache} />
          </>}
        </SideBarTabsContainer>
      </SideBarScrollContainer>
      <LogoutButtonWrapper>
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
    </>

  )
}

export default AdminPanelTabs