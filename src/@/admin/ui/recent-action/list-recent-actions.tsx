import {
  DataTable,
  Table,
  TableHeader,
  TableRow,
} from '@carbon/react';
import { useStore } from 'effector-react';
import { useEffect, useState } from 'react';

import { Link } from '~/lib/router';

import { routeObject } from '../../constants/recent-action.constant';
import { getRecentActionListFx } from '../../effects/recent-action-fx';
import { $recentActionList } from '../../models/recent-action.model';
import { RecentAction } from '../../types/recent-action.type';
import PageTitleComponent from '../common-components/page-title-component';
import {
  DataTableContainer, RecentActionLink, RecentLogScroll, TableDataBody, TableDataCell, TableDataHead, TableWrapper, ToolbarContent,
} from '../styles/admin-styles'
import Pagination from '../common-components/Pagination';

const headers = [
  { key: 'username', header: 'User Name' },
  { key: 'object_repr', header: 'My Action' },
  { key: 'section_type', header: 'Section' },
  { key: 'action_time', header: 'Time' },
  { key: 'action_flag', header: 'Status' },
]


const AdminRecentActions = () => {
  const [{ page, pageSize }, setPageAndSize] = useState({ page: 1, pageSize: 20 });
  const { results: recentActionList, count } = useStore($recentActionList) || {};
  const rows = recentActionList ? recentActionList?.map((recentAction: RecentAction) => ({
    ...recentAction,
    object_repr: recentAction?.action_flag === 'Changed' ?
      <RecentActionLink>
        <Link
          to={routeObject[recentAction?.section_type]}
          params={{ id: recentAction?.object_id }}
        >
          {recentAction?.object_repr}
        </Link>
      </RecentActionLink> : <p>{recentAction?.object_repr}</p>,
  })) : []

  useEffect(() => {
    void getRecentActionListFx({page, pageSize})
  }, [page, pageSize])

  return (
    <>
      <PageTitleComponent
        title={"Recent Actions"}
        subTitle={"List of Recent Actions"}
        recentlyView={false} />
      <DataTable rows={rows} headers={headers} >
        {({
          rows,
          headers,
          getRowProps,
          getSelectionProps,
          getToolbarProps,
          getBatchActionProps,
          onInputChange,
          getTableProps,
          getTableContainerProps
        }) => {
          const batchActionProps = getBatchActionProps();
          return <DataTableContainer {...getTableContainerProps()} >
            <RecentLogScroll >
              <TableWrapper>
                <Table {...getTableProps()} aria-label="sample table">
                  <TableDataHead>
                    <TableRow>
                      {headers.map((header, i) => <TableHeader key={i} >
                        {header.header}
                      </TableHeader>)}
                    </TableRow>
                  </TableDataHead>
                  <TableDataBody>
                    {rows.map((row, i) => <TableRow key={i} {...getRowProps({
                      row
                    })}>
                      {row.cells.map(cell =>
                        <TableDataCell key={cell.id}>{cell.value}</TableDataCell>)}
                    </TableRow>)}
                  </TableDataBody>
                </Table>
              </TableWrapper>
            </RecentLogScroll>
          </DataTableContainer>;
        }}
      </DataTable>
      <Pagination page={page} count={count} pageSize={pageSize} setPage={setPageAndSize} />
    </>
  )
}

export default AdminRecentActions