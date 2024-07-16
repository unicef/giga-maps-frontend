import { Add, Edit, TaskComplete, TrashCan } from '@carbon/icons-react';
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
  TableToolbarSearch,
  Tooltip
} from '@carbon/react';
import { useStore } from 'effector-react';
import { FormEvent, useEffect, useMemo, useState } from "react";

import { deleteCountryFx, getCountryListFx, makeDataSourceValidFx } from '~/@/admin/effects/api-country-fx';
import { $countryListAdmin, CountryListGate } from '~/@/admin/models/country-model';
import { Country } from '~/api/types';
import { addAdminCountry, adminCountry, editAdminCountry, router } from '~/core/routes';
import { Link } from '~/lib/router';

import NoDataAvailable from '../../common-components/no-data-available';
import Pagination from '../../common-components/Pagination';
import {
  CountryListScroll,
  CountryListWrapper,
  DataTableContainer, DeleteConfirmation, TableDataBody, TableDataCell, TableDataHead, TableWrapper, ToolbarContent,
} from "../../styles/admin-styles"

const headers = [
  { key: 'flag', header: 'Flag' },
  { key: 'code', header: 'Code' },
  { key: 'name', header: 'Name' },
  { key: 'data_source', header: 'Data Source' },
  { key: 'date_of_join', header: 'Date of join' },
  { key: 'schools_total', header: 'Total schools' },
  { key: 'action', header: 'Action' },
];

const ListCountry = () => {
  const { results: countryList, count } = useStore($countryListAdmin) || { results: [], count: 0 };
  const rows = useMemo(() => countryList?.map((country: Country) => ({
    ...country,
    flag: <CountryListWrapper>
      <img src={country.flag} />
    </CountryListWrapper>,
    action: <Link to={editAdminCountry} data-testid={`admin-edit-country-${country.id}`} params={{ id: country.id }}><Edit /></Link>
  })), [countryList]);

  const [{ page, pageSize }, setPageAndSize] = useState({ page: 1, pageSize: 20 });
  const [searchValue, setSearchvalue] = useState('');
  const [searchApiCall, setSearchApiCall] = useState(false)
  const [refreshKey, setRefreshKey] = useState(false);
  const [deleteId, setDeleteId] = useState<null | number[]>(null);
  const deleteCountryRecord = async (deleteIds: number[]) => {
    setDeleteId(null)
    const body = {
      id: [...deleteIds]
    }
    try {
      await deleteCountryFx({
        body,
      })
      setRefreshKey(!refreshKey)
      void getCountryListFx({ page, pageSize, search: searchValue })
    }
    catch (e) {
      console.log(e)
    }
  }

  const verifyDataSourceAsValid = async (ids: number[]) => {
    const body = {
      id: [...ids]
    }
    try {
      await makeDataSourceValidFx({
        body
      })
      setRefreshKey(!refreshKey)
    }
    catch (e) {
      console.log(e)
    }
  }

  const batchActionClick = (selectedRows: { id: number }[]) => {

    const selectedId = selectedRows?.map(item => item.id);
    setDeleteId(selectedId)
  };

  const handleVerify = (selectedRows: { id: number }[]) => {
    const selectedId = selectedRows?.map(item => item.id);
    void verifyDataSourceAsValid(selectedId)
  }

  const serachFn = () => {
    setPageAndSize({ page: 1, pageSize });
    setSearchApiCall(!searchApiCall)
  }

  useEffect(() => {
    void getCountryListFx({ page, pageSize, search: searchValue })
  }, [page, pageSize, searchApiCall])

  const onChangeAction = (event: FormEvent) => {
    setSearchvalue(event?.target.value)
  }

  const onEnterKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if(event.key === "Enter"){
      event.preventDefault()
      serachFn()
    }
  }

  return (
    <>
      {deleteId &&
        <DeleteConfirmation>
          <ActionableNotification
            style={{ maxWidth: "100%" }}
            lowContrast inline
            title="Delete country - "
            subtitle="Are you sure?"
            closeOnEscape
            actionButtonLabel="Yes"
            onActionButtonClick={() => void deleteCountryRecord(deleteId)}
            onClose={() => setDeleteId(null)}
          />
        </DeleteConfirmation>
      }
      {countryList && <DataTable key={refreshKey} rows={rows} headers={headers} >
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
                <Tooltip label="Mark country data source as verified (non-OSM)" align='left'>
                  <TableBatchAction
                    onClick={() => {
                      handleVerify(selectedRows)
                    }}
                    renderIcon={TaskComplete}
                    data-testid="verify-selected-country"
                  >
                    Verify
                  </TableBatchAction>
                </Tooltip>
                <TableBatchAction
                  onClick={() => {
                    batchActionClick(selectedRows)
                  }}
                  renderIcon={TrashCan}
                  data-testid="delete-selected-country"
                >
                  Delete
                </TableBatchAction>
              </TableBatchActions>
              <ToolbarContent >
                <TableToolbarSearch
                  onKeyPress={onEnterKeyPress}
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
                <Link to={addAdminCountry}>
                  <Button
                    tabIndex={batchActionProps.shouldShowBatchActions ? -1 : 0}
                    kind="primary"
                    renderIcon={Add}>
                    Add New
                  </Button>
                </Link>
              </ToolbarContent>
            </TableToolbar>
            <CountryListScroll >
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
                  {(rows && rows.length) ? <TableDataBody>
                    {rows.map((row, i) => <TableRow key={i} {...getRowProps({
                      row
                    })}>
                      <TableSelectRow
                        {...getSelectionProps({ row })} />
                      {row.cells.map(cell =>
                        <TableDataCell key={cell.id}>{cell.value}</TableDataCell>)}
                    </TableRow>)}
                  </TableDataBody>
                    :
                    <NoDataAvailable columns={headers.length + 1} />
                  }
                </Table>
              </TableWrapper>
            </CountryListScroll>
          </DataTableContainer>;
        }}
      </DataTable>}
      <Pagination page={page} count={count} pageSize={pageSize} setPage={setPageAndSize} />
      <CountryListGate page={page} />
    </>
  )
}
export default ListCountry