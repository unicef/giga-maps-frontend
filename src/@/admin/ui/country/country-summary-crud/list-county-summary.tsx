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
import { useEffect, useMemo, useState } from 'react';

import { deleteCountrySummaryFx, getCountrySummaryListFx } from '~/@/admin/effects/api-country-fx';
import {
  $countrySummaryList, CountrySummaryListGate,
} from '~/@/admin/models/country-model';
import { $countryList } from '~/@/api-docs/models/explore-api.model';
import { addCountrySummary, editCountrySummary } from '~/core/routes';
import { Link } from '~/lib/router';

import CountryFilterModal from '../../common-components/country-filter-modal';
import NoDataAvailable from '../../common-components/no-data-available';
import Pagination from '../../common-components/Pagination';
import {
  CountrySummaryListScroll,
  DataTableContainer, DeleteConfirmation, TableDataBody, TableDataCell, TableDataHead, TableWrapper, ToolbarContent,
} from "../../styles/admin-styles"

const headers = [
  { key: 'id', header: 'RefId' },
  { key: 'country_name', header: 'Country Name' },
  { key: 'year', header: 'Year' },
  { key: 'week', header: 'Week' },
  { key: 'integration_status', header: 'Integration Status' },
  { key: 'connectivity_speed', header: 'Connectivity Speed' },
  { key: 'schools_total', header: 'School Total' },
  { key: 'schools_connected', header: 'Schools Connected' },
  { key: 'global_schools_connectivity_unknown', header: 'School Connectivity Unknown' },
  { key: 'global_schools_connectivity_no', header: 'School Connectivity Number' },
  { key: 'global_schools_connectivity_moderate', header: 'School Connectivity Moderate' },
  { key: 'schools_connectivity_good', header: 'School Connectivity Good' },
  { key: 'action', header: 'Action' },
];

const ListCountySummary = () => {
  const { results: countrySummaryList, count } = useStore($countrySummaryList) || {};
  const [open, setOpen] = useState(false)
  const [{ page, pageSize }, setPageAndSize] = useState({ page: 1, pageSize: 20 });
  const [countryFilterValues, setCountryFilterValues] = useState<number[]>([]);
  const countryList = useStore($countryList);

  const [searchValue, setSearchvalue] = useState('');
  const [searchApiCall, setSearchApiCall] = useState(false)

  const [deleteId, setDeleteId] = useState<null | number[]>(null);

  const rows = useMemo(() => countrySummaryList ? countrySummaryList?.map((countrySummary) => ({
    ...countrySummary,
    action: <Link to={editCountrySummary} data-testid={`admin-edit-country-summry-${countrySummary.id}`} params={{ id: countrySummary.id }}><Edit /></Link>
  })) : [], [countrySummaryList]);

  const getCountrySummary = async () => {
    void getCountrySummaryListFx({ page, pageSize, search: searchValue, filter: countryFilterValues })
  }

  const deleteCountrySummaryRecord = async (deleteIds: number[]) => {
    setDeleteId(null)
    const body = {
      id: [...deleteIds]
    }
    try {
      await deleteCountrySummaryFx({
        body,
      })
      void getCountrySummary();
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
    void getCountrySummary();
  }, [page, pageSize, getCountrySummaryListFx, countryFilterValues, searchApiCall])

  const serachFn = () => {
    setPageAndSize({ page: 1, pageSize });
    setSearchApiCall(!searchApiCall)
  }

  const onChangeAction = (event: FormEvent) => {
    setSearchvalue(event?.target.value)
  }

  return (
    <>{deleteId &&
      <DeleteConfirmation>
        <ActionableNotification
          style={{ maxWidth: "100%" }}
          lowContrast inline
          title="Delete Country summary- "
          subtitle="Are you sure?"
          closeOnEscape
          actionButtonLabel="Yes"
          onActionButtonClick={() => void deleteCountrySummaryRecord(deleteId)}
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
              <TableBatchActions  {...batchActionProps}>
                <TableBatchAction
                  data-testid='delete-selected-country-summary'
                  onClick={() => {
                    batchActionClick(selectedRows)
                  }}
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
                <TableToolbarMenu renderIcon={Filter}
                  onClick={() => setOpen(true)}
                >
                </TableToolbarMenu>
                <Link to={addCountrySummary}>
                  <Button
                    tabIndex={batchActionProps.shouldShowBatchActions ? -1 : 0}
                    kind="primary"
                    renderIcon={Add}>
                    Add New
                  </Button>
                </Link>
              </ToolbarContent>
            </TableToolbar>
            <CountrySummaryListScroll >
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
                    : <NoDataAvailable columns={headers.length + 1} />
                  }
                </Table>
              </TableWrapper>
            </CountrySummaryListScroll>
          </DataTableContainer>;
        }}
      </DataTable>
      <Pagination page={page} count={count} setPage={setPageAndSize} pageSize={pageSize} />
      <CountrySummaryListGate page={page} />
      <CountryFilterModal
        name='country-summary'
        open={open}
        updateList={(values) => {
          setPageAndSize({ page: 1, pageSize });
          setCountryFilterValues(values as number[])
        }}
        filterValues={[]}
        setOpen={setOpen}
        list={countryList} />
    </>
  )
}

export default ListCountySummary