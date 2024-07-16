import { Search, Table, TableHeader, TableRow } from '@carbon/react';
import { useStore } from 'effector-react';
import { useEffect } from 'react';

import { $userPermissions } from '~/core/auth/models';
import { userDetails } from '~/core/routes';
import { Link } from '~/lib/router';

import { $userListPageNo, $userListResponse, reloadUserList, setSearchUserValue, setUserPageList } from '../../models/user-management.model';
import NoDataAvailable from '../common-components/no-data-available';
import PageTitleComponent from '../common-components/page-title-component';
import Pagination from '../common-components/Pagination';
import { ActiveStatusWrapper, EditIcon, InactiveStatusWrapper, SearchContainer, TableDataBody, TableDataCell, TableDataHead, TableWrapper, UserListScroll } from '../styles/admin-styles'

const UserListComponent = () => {
  const { results: userList, count } = useStore($userListResponse) || {};
  const { page, pageSize } = useStore($userListPageNo);
  const permissions = useStore($userPermissions);

  useEffect(() => {
    reloadUserList();
  }, [])
  return (
    <>
      <PageTitleComponent
        title={"Users"}
        subTitle={"List of users"}
        recentlyView={false} />
      <SearchContainer>
        <Search
          size="lg"
          labelText="Search"
          isExpanded={true}
          closeButtonLabelText="Clear search input"
          id="search-expandable-user-list"
          onChange={(e) => {
            setSearchUserValue(e.target.value)
          }}
        />
      </SearchContainer>
      <UserListScroll >
        <TableWrapper>
          <Table aria-label="user-list-data-table" >
            <TableDataHead >
              <TableRow>
                <TableHeader>
                  Name
                </TableHeader>
                <TableHeader>
                  Email
                </TableHeader>
                <TableHeader>
                  Role
                </TableHeader>
                <TableHeader>
                  Status
                </TableHeader>
                <TableHeader>
                  Action
                </TableHeader>
              </TableRow>
            </TableDataHead>
            {(userList && userList.length > 0) ?
              <TableDataBody >
                {
                  userList?.map((user) => (
                    <TableRow key={user.id} >
                      <TableDataCell >
                        {user.user_name}
                      </TableDataCell>
                      <TableDataCell >
                        {user.email}
                      </TableDataCell>
                      <TableDataCell >
                        {user.role.name}
                      </TableDataCell>
                      <TableDataCell>
                        {
                          user.is_active ?
                            <ActiveStatusWrapper>
                              Active
                            </ActiveStatusWrapper> :
                            <InactiveStatusWrapper>
                              InActive
                            </InactiveStatusWrapper>
                        }
                      </TableDataCell>
                      <TableDataCell>
                        {permissions.CAN_UPDATE_USER &&
                          <Link to={userDetails} params={{ userId: user.id }} data-testid="admin-user-details">
                            <EditIcon size={16} />
                          </Link>
                        }
                      </TableDataCell>
                    </TableRow>
                  ))
                }
              </TableDataBody>
              : <NoDataAvailable columns={4} />
            }
          </Table >
        </TableWrapper>
      </UserListScroll>
      <Pagination page={page} count={count} pageSize={pageSize} setPage={({ page, pageSize }) => setUserPageList({ page, pageSize })} />
    </>
  )
}

export default UserListComponent