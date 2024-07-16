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

import { deleteSchoolDailyFx, getSchoolDailyListFx } from '~/@/admin/effects/api-school-fx';
import { $schoolDailyListAdmin, SchoolDailyListGate } from '~/@/admin/models/school-model';
import { $countryList } from '~/@/api-docs/models/explore-api.model';
import { addSchoolDailySummary, editSchoolDailySummary } from '~/core/routes';
import { Link } from '~/lib/router';

import CountryFilterModal from '../../common-components/country-filter-modal';
import NoDataAvailable from '../../common-components/no-data-available';
import Pagination from '../../common-components/Pagination';
import {
  DataTableContainer, DeleteConfirmation, SchoolListScroll, TableDataBody, TableDataCell, TableDataHead, TableWrapper, ToolbarContent,
} from "../../styles/admin-styles"


const headers = [
  { key: 'school_name', header: 'School name' },
  { key: 'date', header: 'date' },
  { key: 'connectivity_speed', header: 'Connectivity speed' },
  { key: 'connectivity_latency', header: 'Connectivity latency' },
  { key: 'action', header: 'Action' },
];

const ListSchoolDailyConnectivitySummary = () => {


  const { results: schoolDailyList, count } = useStore($schoolDailyListAdmin) || {};
  const [{ page, pageSize }, setPageAndSize] = useState({ page: 1, pageSize: 20 });
  const [countryFilterValues, setCountryFilterValues] = useState<number[]>([]);
  const rows = useMemo(() => schoolDailyList ? schoolDailyList?.map((schoolDaily) => ({
    ...schoolDaily,
    action: <Link to={editSchoolDailySummary} id={`admin-edit-School-daily-summary-${schoolDaily.id}`} params={{ id: schoolDaily.id }}><Edit /></Link>
  })) : [], [schoolDailyList])
  const [open, setOpen] = useState(false)
  const countryList = useStore($countryList)
  const [searchValue, setSearchvalue] = useState('');
  const [searchApiCall, setSearchApiCall] = useState(false)
  const [deleteId, setDeleteId] = useState<null | number[]>(null);

  const getSchoolDailyList = () => {
    void getSchoolDailyListFx({ page, pageSize, search: searchValue, filter: countryFilterValues })
  }

  const deleteSchoolDaily = async (deleteIds: number[]) => {
    setDeleteId(null)
    const body = {
      id: [...deleteIds]
    }
    try {
      await deleteSchoolDailyFx({
        body,
      })
      getSchoolDailyList();
    }
    catch (e) {
      console.log(e)
    }
  }

  const batchActionClick = (selectedRows: { id: number }[]) => {
    const selectedId = selectedRows?.map(item => item.id);
    setDeleteId(selectedId)
  }

  useEffect(() => {
    void getSchoolDailyList();
  }, [page, pageSize, countryFilterValues, searchApiCall])

  const serachFn = () => {
    setPageAndSize({ page: 1, pageSize });
    setSearchApiCall(!searchApiCall)
  }

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
            title="Delete school daily summary - "
            subtitle="Are you sure?"
            closeOnEscape
            actionButtonLabel="Yes"
            onActionButtonClick={() => void deleteSchoolDaily(deleteId)}
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
                  renderIcon={TrashCan}
                  id='delete-selected-School-daily-Summary'
                >
                  Delete
                </TableBatchAction>
              </TableBatchActions>
              <ToolbarContent aria-hidden={batchActionProps.shouldShowBatchActions}>
                <TableToolbarSearch tabIndex={batchActionProps.shouldShowBatchActions ? -1 : 0}
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
                <TableToolbarMenu renderIcon={Filter} onClick={() => setOpen(true)} >
                </TableToolbarMenu>
                <Link to={addSchoolDailySummary}>
                  <Button
                    tabIndex={batchActionProps.shouldShowBatchActions ? -1 : 0}
                    kind="primary"
                    renderIcon={Add}>
                    Add New
                  </Button>
                </Link>
              </ToolbarContent>
            </TableToolbar>
            <SchoolListScroll >
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
                  {
                    (rows && rows.length > 0) ?
                      <TableDataBody>
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
            </SchoolListScroll>
          </DataTableContainer>;
        }}
      </DataTable>
      <Pagination page={page} count={count} setPage={setPageAndSize} pageSize={pageSize} />
      <SchoolDailyListGate page={page} />
      <CountryFilterModal
        name='school-daily-list'
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

export default ListSchoolDailyConnectivitySummary