import { Add } from '@carbon/icons-react';
import { ActionableNotification, Button, Table, TableHeader, TableRow } from '@carbon/react'
import { createEvent, sample } from 'effector';
import { useStore } from 'effector-react';
import { useEffect, useState } from 'react';

import { $userPermissions } from '~/core/auth/models';
import { editRoles, roleCreateRoute } from '~/core/routes';
import { Link } from '~/lib/router';

import { deleteRoleFx, getRolesListFx } from '../../effects/user-management-fx';
import { $roleListResponse } from '../../models/user-management.model';
import PageTitleComponent from '../common-components/page-title-component'
import Pagination from '../common-components/Pagination';
import { DeleteIcon, EditIcon, RolesListScroll, SearchContainer, TableCellRoles, TableDataBody, TableDataCell, TableDataHead, TableWrapper } from '../styles/admin-styles'
import { setRoleDescription, setRoleName } from './create-role.view';


const filterRoleListById = createEvent<number>();
sample({
  clock: filterRoleListById,
  source: $roleListResponse,
  fn: (roleListResponse, roleId) => {
    if (roleListResponse) {
      const { results, count } = roleListResponse;
      const roleList = results.filter(role => role.id !== roleId);
      return { ...roleListResponse, results: roleList, count: count - 1 }
    }
    return roleListResponse;
  },
  target: $roleListResponse
})

const RolesList = () => {
  const { results: roleList, count } = useStore($roleListResponse) ?? {};
  const [{ page, pageSize }, setPageAndSize] = useState({ page: 1, pageSize: 20 });
  const [deleteId, setDeleteId] = useState<null | number>(null);
  const permissions = useStore($userPermissions);

  useEffect(() => {
    void getRolesListFx({ page, pageSize });
  }, [page, pageSize]);

  const onDeleteRole = async (id: number) => {
    setDeleteId(null);
    try {
      await deleteRoleFx({ roleId: id })
      filterRoleListById(id)
    } catch (e) { console.error(e) }
  }

  return (
    <>
      <PageTitleComponent
        title={"Roles"}
        subTitle={"List of user roles"}
        recentlyView={true} />
      <SearchContainer>
        {deleteId && <ActionableNotification
          lowContrast inline
          title="Delete role - "
          subtitle="Are you sure?"
          closeOnEscape
          actionButtonLabel="Yes"
          onActionButtonClick={() => void onDeleteRole(deleteId)}
          onClose={() => setDeleteId(null)}
        />}
        {/* <ExpandableSearch size="lg"
          labelText="Search"
          closeButtonLabelText="Clear search input"
          id="search-expandable-user-list"
          onChange={() => { }}
          onKeyDown={() => { }} /> */}
        <Link to={roleCreateRoute}>
          <Button
            disabled={!permissions.CAN_CREATE_ROLE_CONFIGURATIONS}
            onClick={() => {
              setRoleName('')
              setRoleDescription('')
            }}
            data-testid="admin-role-add"
            renderIcon={Add}>
            Add new role
          </Button>
        </Link>
      </SearchContainer>
      <RolesListScroll >
        <TableWrapper>
          <Table aria-label="user-roles-data-table" >
            <TableDataHead >
              <TableRow>
                <TableHeader>
                  Role
                </TableHeader>
                <TableHeader>
                  Category
                </TableHeader>
                <TableHeader>
                  Action
                </TableHeader>
              </TableRow>
            </TableDataHead>
            <TableDataBody >
              {
                roleList?.map((role) => (
                  <TableRow key={role.id}>
                    <TableCellRoles  >
                      {role?.name}
                    </TableCellRoles>
                    <TableCellRoles>
                      {role?.category.charAt(0).toUpperCase() + role?.category.slice(1).toLowerCase()}
                    </TableCellRoles>
                    <TableDataCell>
                      {permissions.CAN_UPDATE_ROLE_CONFIGURATIONS && role?.category !== 'system' && <Link
                        to={editRoles}
                        data-testid="admin-role-edit"
                        params={{ id: role.id }}
                      >
                        <EditIcon size={16} />
                      </Link>
                      }
                      {permissions.CAN_DELETE_ROLE_CONFIGURATIONS && role?.category !== 'system' &&
                        <span style={{ marginLeft: 10 }} onClick={() => setDeleteId(role.id)} onKeyDown={this.handleKeyDown} data-testid="admin-role-delete">
                          <DeleteIcon size={16} />
                        </span>
                      }
                    </TableDataCell>
                  </TableRow>
                ))
              }
            </TableDataBody>
          </Table >
        </TableWrapper>
      </RolesListScroll >
      <Pagination page={page} count={count} pageSize={pageSize} setPage={setPageAndSize} />
    </>
  )
}

export default RolesList;