import { Add, Edit, Filter, TrashCan, Upload } from '@carbon/icons-react';
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

import { deleteSchoolFx, getSchoolListFx } from '~/@/admin/effects/api-school-fx';
import { $schoolListAdmin, } from '~/@/admin/models/school-model';
import { $countryList } from '~/@/api-docs/models/explore-api.model';
import { $userPermissions } from '~/core/auth/models';
import { addAdminSchools, editAdminSchools, } from '~/core/routes';
import { Link } from '~/lib/router';

import CountryFilterModal from '../../common-components/country-filter-modal';
import NoDataAvailable from '../../common-components/no-data-available';
import Pagination from '../../common-components/Pagination';
import {
  DataTableContainer, DeleteConfirmation, SchoolListScroll, TableDataBody, TableDataCell, TableDataHead, TableWrapper, ToolbarContent,
} from "../../styles/admin-styles"
import ModalImportCsv from './modal-import-csv';

const headers = [
  { key: 'name', header: 'School Name' },
  { key: 'country_name', header: 'Country' },
  { key: 'giga_id_school', header: 'GigaId School' },
  { key: 'address', header: 'Address' },
  { key: 'education_level', header: 'Education Level' },
  { key: 'school_type', header: 'School Type' },
  { key: 'education_level_regional', header: 'Education level Regional' },
  { key: 'action', header: 'Action' },
];

const ListSchools = () => {
  const { results: schoolList, count } = useStore($schoolListAdmin) || {};
  const [{ page, pageSize }, setPageAndSize] = useState({ page: 1, pageSize: 20 });
  const [countryFilterValues, setCountryFilterValues] = useState<number[]>([]);
  const permissions = useStore($userPermissions);
  const rows = useMemo(() => schoolList ? schoolList?.map((school) => ({
    ...school,
    action: <Link id={`admin-edit-School-${school.id}`} to={editAdminSchools} params={{ id: school.id }}><Edit /></Link>
  })) : [], [schoolList])

  const [open, setOpen] = useState(false)
  const [openCsvModal, setCsvModal] = useState(false)
  const countryList = useStore($countryList)
  const [searchValue, setSearchvalue] = useState('');
  const [searchApiCall, setSearchApiCall] = useState(false)
  const [deleteId, setDeleteId] = useState<null | number[]>(null);

  const getSchoolList = () => {
    void getSchoolListFx({ page, pageSize, search: searchValue, filter: countryFilterValues })
  }

  const deleteSchool = async (deleteIds: number[]) => {
    setDeleteId(null)
    const body = {
      id: [...deleteIds]
    }
    try {
      await deleteSchoolFx({
        body,
      })
      void getSchoolList();
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
    void getSchoolList();
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
            title="Delete School - "
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
          selectedRows,
          getTableProps,
          getTableContainerProps
        }) => {
          const batchActionProps = getBatchActionProps();
          return <DataTableContainer {...getTableContainerProps()} >
            <TableToolbar {...getToolbarProps()}>
              <TableBatchActions  {...batchActionProps}>
                <TableBatchAction
                  onClick={() => {
                    batchActionClick(selectedRows)
                  }}
                  renderIcon={TrashCan}
                  id='delete-selected-School'
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
                <TableToolbarMenu renderIcon={Filter}
                  onClick={() => setOpen(true)}
                >
                </TableToolbarMenu>
                <Button
                  className='import-csv-button'
                  id='admin-import-csv'
                  tabIndex={batchActionProps.shouldShowBatchActions ? -1 : 0}
                  kind="primary"
                  onClick={() => setCsvModal(true)}
                  renderIcon={Upload}>
                  Import CSV
                </Button>
                {permissions.CAN_ADD_SCHOOL &&
                  <Link to={addAdminSchools}>
                    <Button
                      tabIndex={batchActionProps.shouldShowBatchActions ? -1 : 0}
                      kind="primary"
                      renderIcon={Add}>
                      Add New
                    </Button>
                  </Link>
                }
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
                  {(rows && rows.length > 0) ? <TableDataBody>
                    {rows.map((row, i) =>

                      <TableRow key={i} {...getRowProps({
                        row
                      })}>
                        <TableSelectRow {...getSelectionProps({ row })} />
                        {row.cells.map(cell =>
                          <TableDataCell key={cell.id}>{cell.value}</TableDataCell>)}
                      </TableRow>)}
                  </TableDataBody> : <NoDataAvailable columns={headers.length + 1} />}
                </Table>
              </TableWrapper>
            </SchoolListScroll>
          </DataTableContainer >;
        }}
      </DataTable >
      <Pagination page={page} count={count} pageSize={pageSize} setPage={setPageAndSize} />
      <ModalImportCsv
        open={openCsvModal}
        setOpen={setCsvModal} />
      <CountryFilterModal
        name='school-list'
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

export default ListSchools