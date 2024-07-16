import { Add, Edit, Filter, TrashCan } from '@carbon/icons-react';
import {
  ActionableNotification,
  Button,
  DataTable,
  Table,
  TableBatchAction,
  TableBatchActions,
  TableHeader,
  TableRow,
  TableSelectAll,
  TableSelectRow,
  TableToolbar,
  TableToolbarMenu,
  TableToolbarSearch
} from '@carbon/react';
import { useStore } from 'effector-react';
import { useEffect, useState } from 'react';

import { deleteCountryDailySummaryFx, getCountryDailySummaryListFx } from '~/@/admin/effects/api-country-fx';
import { $countryDailySummaryList, CountryDailySummaryListGate } from '~/@/admin/models/country-model';
import { $countryList } from '~/@/api-docs/models/explore-api.model';
import { addCountryDailySummary, editCountryDailySummary } from '~/core/routes';
import { Link } from '~/lib/router';

import CountryFilterModal from '../../common-components/country-filter-modal';
import NoDataAvailable from '../../common-components/no-data-available';
import Pagination from '../../common-components/Pagination';
import {
  CountryDailySummaryListScroll,
  DataTableContainer, DeleteConfirmation, TableDataBody, TableDataCell, TableDataHead, TableWrapper, ToolbarContent,
} from "../../styles/admin-styles"


const headers = [
  { key: 'country_name', header: 'Country Name' },
  { key: 'date', header: 'Date' },
  { key: 'connectivity_speed', header: 'Connectivity Speed' },
  { key: 'connectivity_latency', header: 'Connectivity Latency' },
  { key: 'action', header: 'Action' },
];

const ListCountryDailySummary = () => {
  const { results: countryDailySummaryList, count } = useStore($countryDailySummaryList) || {};
  const [{ page, pageSize }, setPageAndSize] = useState({ page: 1, pageSize: 20 });
  const [countryFilterValues, setCountryFilterValues] = useState<number[]>([]);
  const [open, setOpen] = useState(false)
  const countryList = useStore($countryList)
  const [searchValue, setSearchvalue] = useState('');
  const [searchApiCall, setSearchApiCall] = useState(false)
  const [deleteId, setDeleteId] = useState<null | number[]>(null);
  const rows = countryDailySummaryList ? countryDailySummaryList?.map((countrySummary) => ({
    ...countrySummary,
    action: <Link to={editCountryDailySummary} data-testid={`edit-country-daily-summary-${countrySummary.id}`} params={{ id: countrySummary.id }}><Edit /></Link>
  })) : []

  const getCountrySummaryDailyList = () => {
    void getCountryDailySummaryListFx({ page, pageSize, search: searchValue, filter: countryFilterValues })
  }

  const deleteCountryDailySummaryRecord = async (deleteIds: number[]) => {
    setDeleteId(null)
    const body = {
      id: [...deleteIds]
    }
    try {
      await deleteCountryDailySummaryFx({
        body,
      })
      void getCountrySummaryDailyList();
    }
    catch (e) {
      console.log(e)
    }
  }

  const batchActionClick = (selectedRows: { id: number }[]) => {
    const selectedId = selectedRows?.map(item => item.id);
    setDeleteId(selectedId)
  };

  useEffect(() => {
    void getCountrySummaryDailyList();
  }, [page, countryFilterValues, pageSize, searchApiCall])

  const serachFn = () => {
    setPageAndSize({ page: 1, pageSize });
    setSearchApiCall(!searchApiCall)
  }

  const onChangeAction = (event: FormEvent) => {
    setSearchvalue(event?.target.value)
  }

  return (
    <>
      {deleteId &&
        <DeleteConfirmation>
          <ActionableNotification
            style={{ maxWidth: "100%" }}
            lowContrast inline
            title="Delete Country daily summary- "
            subtitle="Are you sure?"
            closeOnEscape
            actionButtonLabel="Yes"
            onActionButtonClick={() => void deleteCountryDailySummaryRecord(deleteId)}
            onClose={() => setDeleteId(null)}
          />
        </DeleteConfirmation>
      }
      <DataTable rows={rows} headers={headers} >
        {({
          rows,
          headers,
          getRowProps,
          getSelectionProps,
          getToolbarProps,
          getBatchActionProps,
          selectedRows,
          getTableProps,
          getTableContainerProps
        }) => {
          const batchActionProps = getBatchActionProps();
          return <DataTableContainer {...getTableContainerProps()} >
            <TableToolbar {...getToolbarProps()}>
              <TableBatchActions {...batchActionProps}>
                <TableBatchAction
                  onClick={() => {
                    batchActionClick(selectedRows)
                  }}
                  data-testid="delete-country-daily-summary"
                  renderIcon={TrashCan} >
                  Delete
                </TableBatchAction>
              </TableBatchActions>
              <ToolbarContent aria-hidden={batchActionProps.shouldShowBatchActions}>
                <TableToolbarSearch tabIndex={batchActionProps.shouldShowBatchActions ? -1 : 0}
                  onClear={() => {
                    setSearchvalue('')
                    serachFn()
                  }}
                  onChange={(evt) => {
                    onChangeAction(evt);
                  }} />
                <Button
                  kind="secondary"
                  onClick={() => serachFn()}
                >
                  Search
                </Button>
                <TableToolbarMenu renderIcon={Filter} onClick={() => setOpen(true)} >
                </TableToolbarMenu>
                <Link to={addCountryDailySummary}>
                  <Button
                    tabIndex={batchActionProps.shouldShowBatchActions ? -1 : 0}
                    kind="primary"
                    renderIcon={Add}>
                    Add New
                  </Button>
                </Link>
              </ToolbarContent>
            </TableToolbar>
            <CountryDailySummaryListScroll >
              <TableWrapper>
                <Table {...getTableProps()} aria-label="sample table">
                  <TableDataHead>
                    <TableRow>
                      <TableSelectAll {...getSelectionProps()} />
                      {headers.map((header, i) => <TableHeader key={i} >
                        {header.header}
                      </TableHeader>)}
                    </TableRow>
                  </TableDataHead>
                  {(rows && rows.length > 0) ? <TableDataBody>
                    {rows.map((row, i) => <TableRow key={i} {...getRowProps({
                      row
                    })}>
                      <TableSelectRow
                        {...getSelectionProps({ row })}
                      />
                      {row.cells.map(cell =>
                        <TableDataCell key={cell.id}>{cell.value}</TableDataCell>)}
                    </TableRow>)}
                  </TableDataBody>
                    :
                    <NoDataAvailable columns={headers.length + 1} />
                  }
                </Table>
              </TableWrapper>
            </CountryDailySummaryListScroll>
          </DataTableContainer>;
        }}
      </DataTable>
      <Pagination page={page} count={count} setPage={setPageAndSize} pageSize={pageSize} />
      <CountryDailySummaryListGate page={page} />
      <CountryFilterModal
        name="country-daily-summary"
        open={open}
        updateList={(values) => {
          setPageAndSize({ page: 1, pageSize });
          setCountryFilterValues(values as number[])
        }}
        filterValues={[]}
        setOpen={setOpen}
        list={countryList}
      />
    </>
  )
}

export default ListCountryDailySummary