import { CheckmarkFilled, CheckmarkOutline } from '@carbon/icons-react';
import { Button, Table, TableCell, TableHeader, TableRow } from '@carbon/react';
import React from 'react'

import { Scroll } from '@/scroll';

import PageTitleComponent from '../common-components/page-title-component';
import { BottomButtonWrapper, PermissionsTableWrapper, TableDataBody, TableDataHead, TableTopHead, TableWrapper } from '../styles/admin-styles';

const UserPermissionComponent = () => {

  const tableData = [
    {
      id: 1, title: "Admin",
      permissions: [{
        permissionsName: "Log Entry",
        canAdd: 0, canChange: 1, canDelete: 0, canView: 0
      }]
    }, {
      id: 2, title: "Background",
      permissions: [{
        permissionsName: "Background Task",
        canAdd: 0, canChange: 0, canDelete: 0, canView: 0
      }]
    },
    {
      id: 3, title: "Giga layer",
      permissions: [{
        permissionsName: "Log Entry",
        canAdd: 1, canChange: 1, canDelete: 1, canView: 0
      }]
    },
    {
      id: 4, title: "Geography",
      permissions: [{
        permissionsName: "Country",
        canAdd: 1, canChange: 1, canDelete: 0, canView: 0
      },
      {
        permissionsName: "School",
        canAdd: 0, canChange: 1, canDelete: 1, canView: 0
      },
      {
        permissionsName: "Admin",
        canAdd: 1, canChange: 1, canDelete: 0, canView: 0
      }]
    },
    {
      id: 5, title: "User Management",
      permissions: [{
        permissionsName: "User",
        canAdd: 1, canChange: 1, canDelete: 0, canView: 0
      }, {
        permissionsName: "Group",
        canAdd: 0, canChange: 0, canDelete: 0, canView: 0
      },
      {
        permissionsName: "Permission",
        canAdd: 1, canChange: 1, canDelete: 0, canView: 0
      }]
    }, {
      id: 6, title: "Contact",
      permissions: [{
        permissionsName: "Contact",
        canAdd: 0, canChange: 1, canDelete: 0, canView: 0
      }]
    }]
  return (
    <>
      <PageTitleComponent
        title={"Permissions"}
        subTitle={"List of permissions"}
        recentlyView={false} />
      <Scroll >
        <PermissionsTableWrapper>
          <Table aria-label="user-list-data-table" >
            <TableTopHead >
              <TableRow>
                <TableHeader>
                  Permissions
                </TableHeader>
                <TableHeader>
                  Can Add
                </TableHeader>
                <TableHeader>
                  Can Change
                </TableHeader>
                <TableHeader>
                  Can Delete
                </TableHeader>
                <TableHeader>
                  Can View
                </TableHeader>
              </TableRow>
            </TableTopHead>
            {
              tableData.map((mainObject, index) => (
                <>
                  <TableDataHead key={index + "i"}>
                    <TableRow>
                      <TableHeader>
                        {mainObject.title}
                      </TableHeader>
                      <TableHeader>
                      </TableHeader>
                      <TableHeader>
                      </TableHeader>
                      <TableHeader>
                      </TableHeader>
                      <TableHeader>
                      </TableHeader>
                    </TableRow>
                  </TableDataHead>
                  <TableDataBody >
                    {
                      mainObject.permissions.map((object, i) => (
                        <TableRow key={i}>
                          <TableCell >
                            {object.permissionsName}
                          </TableCell>
                          <TableCell >
                            <CheckmarkOutline size={16} />
                            {/* {
                              object.canAdd ?
                                <CheckmarkFilled size={16} /> :
                            } */}
                          </TableCell>
                          <TableCell >
                            <CheckmarkOutline size={16} />
                            {/* {
                              object.canChange ?
                                <CheckmarkFilled size={16} /> :
                            } */}
                          </TableCell>
                          <TableCell >
                            <CheckmarkOutline size={16} />
                            {/* {
                              object.canDelete ?
                                <CheckmarkFilled size={16} /> :
                            } */}
                          </TableCell>
                          <TableCell >
                            {/* {
                              object.canView ?
                                <CheckmarkFilled size={16} /> :
                              } */}
                            <CheckmarkOutline size={16} />
                          </TableCell>
                        </TableRow>
                      ))
                    }
                  </TableDataBody>
                </>
              ))
            }
          </Table >
        </PermissionsTableWrapper>
      </Scroll>
      {/* <BottomButtonWrapper>
        <Button
          kind="secondary"
          onClick={() => { }}>
          Cancel
        </Button>
        <Button
          kind="primary"
          onClick={() => { }}>
          Save
        </Button>
      </BottomButtonWrapper> */}
    </>
  )
}

export default UserPermissionComponent