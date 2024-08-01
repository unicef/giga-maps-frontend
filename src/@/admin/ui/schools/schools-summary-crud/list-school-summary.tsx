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

import { deleteSchoolSummaryFx, getSchoolSummaryListFx } from '~/@/admin/effects/api-school-fx';
import { $schoolSummaryListAdmin, } from '~/@/admin/models/school-model';
import { $countryList } from '~/@/api-docs/models/explore-api.model';
import { addSchoolSummary, editSchoolSummary } from '~/core/routes';
import { Link } from '~/lib/router';

import CountryFilterModal from '../../common-components/country-filter-modal';
import NoDataAvailable from '../../common-components/no-data-available';
import Pagination from '../../common-components/Pagination';
import {
  DataTableContainer, DeleteConfirmation, SchoolListScroll, TableDataBody, TableDataCell, TableDataHead, TableWrapper, ToolbarContent,
} from "../../styles/admin-styles"


const headers = [
  { key: 'id', header: 'RefId' },
  { key: 'school_name', header: 'School name' },
  { key: 'year', header: 'Year' },
  { key: 'week', header: 'Week' },
  { key: 'connectivity_speed', header: 'Connectivity speed' },
  { key: 'connectivity_latency', header: 'Connectivity latency' },
  { key: 'num_students', header: 'Number of students' },
  { key: 'num_teachers', header: 'Number of teachers' },
  { key: 'action', header: 'Action' },

];



const ListSchoolSummary = () => {
  const { results: schoolSummaryList, count } = useStore($schoolSummaryListAdmin) ?? {};
  const [{ page, pageSize }, setPageAndSize] = useState({ page: 1, pageSize: 20 });
  const [countryFilterValues, setCountryFilterValues] = useState<number[]>([]);
  const rows = useMemo(() => schoolSummaryList ? schoolSummaryList?.map((schoolSummary) => ({
    ...schoolSummary,
    action: <Link to={editSchoolSummary} id={`admin-edit-School-summary-${schoolSummary.id}`} params={{ id: schoolSummary.id }}><Edit /></Link>
  })) : [], [schoolSummaryList])

  const [open, setOpen] = useState(false)
  const countryList = useStore($countryList)
  const [searchValue, setSearchValue] = useState('');
  const [searchApiCall, setSearchApiCall] = useState(false)
  const [deleteId, setDeleteId] = useState<null | number[]>(null);

  const getSchoolSummaryList = () => {
    void getSchoolSummaryListFx({ page, pageSize, search: searchValue, filter: countryFilterValues.join(',') })
  }

  const deleteSchool = async (deleteIds: number[]) => {
    setDeleteId(null)
    const body = {
      id: [...deleteIds]
    }
    try {
      await deleteSchoolSummaryFx({
        body,
      })
      getSchoolSummaryList();
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
    getSchoolSummaryList();
  }, [page, pageSize, countryFilterValues, searchApiCall])

  const serachFn = () => {
    setPageAndSize({ page: 1, pageSize });
    setSearchApiCall(!searchApiCall)
  }

  const onChangeAction = (event: FormEvent) => {
    setSearchValue(event?.target.value)
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
            title="Delete school summary - "
            subtitle="Are you sure?"
            closeOnEscape
            actionButtonLabel="Yes"
            onActionButtonClick={() => void deleteSchool(deleteId)}
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
          onInputChange,
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
                  id='delete-selected-School-Summary'
                  renderIcon={TrashCan} >
                  Delete
                </TableBatchAction>
              </TableBatchActions>
              <ToolbarContent aria-hidden={batchActionProps.shouldShowBatchActions}>
                <TableToolbarSearch tabIndex={batchActionProps.shouldShowBatchActions ? -1 : 0}
                  onKeyPress={onEnterKeyPress}
                  onClear={() => {
                    setSearchValue('')
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
                <Link to={addSchoolSummary}>
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
                      {headers.map((header, i) => <TableHeader key={`${header.key}-${i}`} >
                        {header.header}
                      </TableHeader>)}
                    </TableRow>
                  </TableDataHead>
                  {(rows && rows.length > 0) ?
                    <TableDataBody>
                      {rows.map((row, i) => <TableRow key={`${row.id}-${i}`} {...getRowProps({
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
      <CountryFilterModal
        name='school-summary-list'
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

export default ListSchoolSummary