import {
  Button,
  DataTable,
  IconButton,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  TableToolbar,
} from '@carbon/react';
import PageTitleComponent from '../common-components/page-title-component';
import {
  DataTableContainer, DeleteConfirmation, RecentLogScroll, TableDataBody, TableDataHead, TableWrapper, ToolbarContent,
} from '../styles/admin-styles'
import { Add, Edit, Delete } from '@carbon/icons-react';
import { useEffect, useMemo, useState } from 'react';
import { useStore } from 'effector-react';
import { $filterListResponse } from '../../models/filter-list.model';
import { deleteFilterApiKeyRequestFx, getFilterListFx } from '../../effects/filter-fx';
import { addAdminFilter, editAdminFilter } from '~/core/routes';
import { ActionableNotification } from '@carbon/react';
import { Link } from '~/lib/router';
import { Div } from '~/@/common/style/styled-component-style';

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

  const deleteFilterData = async (id: number) => {
    setApiKeyDeleteId(null)
    try {
      await deleteFilterApiKeyRequestFx({ id })
    } catch (e) { console.error(e) }
  }

  const rows = useMemo(() => filterList?.map((item) => ({
    ...item,
    action: <Div style={{ display: "flex", marginLeft: "-16px" }}>
      <Link to={editAdminFilter} params={{ id: item.id ?? 0 }}>
        <IconButton
          kind='ghost'
          size='md'
          label='Edit'
          tooltipText='Edit'
          onClick={() => { }}
        ><Edit /></IconButton>
      </Link>
      <IconButton
        kind='ghost'
        size='md'
        label='Delete'
        tooltipText='Delete'
        renderIcon={Delete}
        onClick={() => setApiKeyDeleteId(item.id ?? 0)}
      ></IconButton>
    </Div>
  })), [filterList]);

  useEffect(() => {
    void getFilterListFx();
  }, [])

  console.log("rows", rows);

  return (
    <>
      <PageTitleComponent
        title={"Filters"}
        subTitle={"Lorem Ipsum"}
        recentlyView={false} />
      {!!apiKeyDeleteId &&
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
                <Link to={addAdminFilter}>
                  <Button
                    renderIcon={Add}
                    onClick={() => { }}
                  >
                    Add new filter
                  </Button>
                </Link>
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