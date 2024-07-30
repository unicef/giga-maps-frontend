import {
  Button,
  DataTable,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  TableToolbar,
  OverflowMenu,
} from '@carbon/react';
import PageTitleComponent from '../common-components/page-title-component';
import {
  DataTableContainer, DeleteConfirmation, RecentLogScroll, TableDataBody, TableDataHead, TableWrapper, ToolbarContent,
} from '../styles/admin-styles'
import { Add, Edit } from '@carbon/icons-react';
import { Link } from '~/lib/router';
import { useEffect, useMemo, useState } from 'react';
import { useStore } from 'effector-react';
import { $filterListResponse } from '../../models/filter-list.model';
import { deleteFilterApiKeyRequestFx, getFilterListFx } from '../../effects/filter-fx';
import { editAdminFilter } from '~/core/routes';
import { $showFilterSidebar, onShowFilterSidebar } from '~/@/sidebar/sidebar.model';
import AddFilterList from './add.view';
import { OverflowMenuItem } from '@carbon/react';
import { ActionableNotification } from '@carbon/react';

const headers = [
  { key: 'filter_name', header: 'Filter name' },
  { key: 'parameter', header: 'Parameter' },
  { key: 'filter_type', header: 'Filter type' },
  { key: 'filter_options', header: 'Filter options' },
  { key: 'countries', header: 'Countries' },
  { key: 'publisher', header: 'Publisher' },
  { key: 'action', header: 'Action' },
]

const ListFilterView = () => {
  const [apiKeyDeleteId, setApiKeyDeleteId] = useState<null | number>(null);
  const filterList = useStore($filterListResponse) || { results: [] };
  const isOpen = useStore($showFilterSidebar)

  const openFilterSidebar = () => {
    onShowFilterSidebar(!isOpen);
  };

  const deleteFilterData = async (id: number) => {
    setApiKeyDeleteId(null)
    try {
      await deleteFilterApiKeyRequestFx({ id })
    } catch (e) { console.error(e) }
  }

  const rows = useMemo(() => filterList?.map((item) => ({
    ...item,
    action:
      <OverflowMenu aria-label="overflow-menu" flipped={true}>
        <OverflowMenuItem itemText="Edit" onClick={(e) => {
          e.preventDefault();
          editAdminFilter.navigate({ id: item.id })
        }}>
        </OverflowMenuItem>
        <OverflowMenuItem itemText="Delete" onClick={() => { setApiKeyDeleteId(item.id) }}></OverflowMenuItem>
      </OverflowMenu>
  })), [filterList]);

  useEffect(() => {
    void getFilterListFx();
  }, [])

  console.log("rows", rows);

  return (
    <>
      {isOpen && <AddFilterList openFilterSidebar={openFilterSidebar} />}
      <PageTitleComponent
        title={"Filters"}
        subTitle={"Lorem Ipsum"}
        recentlyView={false} />
      {apiKeyDeleteId &&
        <DeleteConfirmation>
          <ActionableNotification
            style={{ maxWidth: "100%" }}
            lowContrast inline
            title="Delete filter data - "
            subtitle="Are you sure?"
            closeOnEscape
            actionButtonLabel="Yes"
            onActionButtonClick={() => void deleteFilterData(apiKeyDeleteId)}
            onClose={() => setApiKeyDeleteId(null)}
          />
        </DeleteConfirmation>
      }
      <DataTable rows={rows} headers={headers} >
        {({
          rows,
          headers,
          getTableProps,
          getHeaderProps,
          getRowProps,
          getBatchActionProps,
          getToolbarProps
        }) => {
          const batchActionProps = getBatchActionProps();
          return <DataTableContainer>
            <TableToolbar {...getToolbarProps()}>
              <ToolbarContent>
                <Button
                  onClick={openFilterSidebar}
                  tabIndex={batchActionProps.shouldShowBatchActions ? -1 : 0}
                  kind="primary"
                  renderIcon={Add}>
                  Add new filter
                </Button>
              </ToolbarContent>
            </TableToolbar>
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
                    {rows.map((row) =>
                      <TableRow key={row.id} {...getRowProps({ row })}>
                        {row.cells.map((cell) =>
                          <TableCell key={cell.id}>{cell.value}</TableCell>
                        )}
                      </TableRow>
                    )}
                  </TableDataBody>
                </Table>
              </TableWrapper>
            </RecentLogScroll>
          </DataTableContainer>;
        }}
      </DataTable>
    </>
  )
}

export default ListFilterView;