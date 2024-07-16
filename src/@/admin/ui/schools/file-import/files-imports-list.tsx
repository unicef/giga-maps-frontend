import { Upload } from '@carbon/icons-react';
import {
  Button,
  DataTable,
  Link,
  Table,
  TableHeader,
  TableRow,
  TableToolbar,
  TableToolbarSearch
} from '@carbon/react';
import { useStore } from 'effector-react';
import { useEffect, useMemo, useState } from 'react';

import { getCsvImportListFx } from '~/@/admin/effects/api-school-fx';
import { $importCsvList, } from '~/@/admin/models/school-model';

import NoDataAvailable from '../../common-components/no-data-available';
import Pagination from '../../common-components/Pagination';
import {
  DataTableContainer, SchoolListScroll, TableDataBody, TableDataCell, TableDataHead, TableWrapper, ToolbarContent,
} from "../../styles/admin-styles"
import ModalImportCsv from '../schools-crude/modal-import-csv';


const headers = [
  { key: 'id', header: 'Id' },
  { key: 'country_name', header: 'Country' },
  { key: 'uploaded_file', header: 'Uploaded file' },
  { key: 'status', header: 'Status' },
  { key: 'uploaded_by_name', header: 'Uploaded by' },
  { key: 'modified', header: 'Modified' },
];

const FilesImportsList = () => {
  const { results: importList, count } = useStore($importCsvList) || {};
  const [{ page, pageSize }, setPageAndSize] = useState({ page: 1, pageSize: 20 });

  const rows = useMemo(() => importList ? importList?.map((importListItem) => ({
    ...importListItem,
    uploaded_file: <Link href={importListItem?.uploaded_file}  >{importListItem?.uploaded_file}</Link>
  })) : [], [importList])

  const [searchValue, setSearchvalue] = useState('');
  const [searchApiCall, setSearchApiCall] = useState(false)

  const [openCsvModal, setCsvModal] = useState(false)

  useEffect(() => {
    void getCsvImportListFx({ page, pageSize, search: searchValue })
  }, [page, pageSize, searchApiCall])

  const serachFn = () => {
    setPageAndSize({ page: 1, pageSize });
    setSearchApiCall(!searchApiCall)
  }

  const onChangeAction = (event: FormEvent) => {
    setSearchvalue(event?.target.value)
  }

  return (
    <>
      <DataTable rows={rows} headers={headers} >
        {({
          rows,
          headers,
          getRowProps,
          getToolbarProps,
          getBatchActionProps,
          selectedRows,
          getTableProps,
          getTableContainerProps
        }) => {
          const batchActionProps = getBatchActionProps();
          return <DataTableContainer {...getTableContainerProps()} >
            <TableToolbar {...getToolbarProps()}>
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
                <Button
                  className='import-csv-button'
                  id='admin-import-csv'
                  tabIndex={batchActionProps.shouldShowBatchActions ? -1 : 0}
                  kind="primary"
                  onClick={() => setCsvModal(true)}
                  renderIcon={Upload}>
                  Import CSV
                </Button>
              </ToolbarContent>
            </TableToolbar>
            <SchoolListScroll >
              <TableWrapper>
                <Table {...getTableProps()} aria-label="sample table">
                  <TableDataHead>
                    <TableRow>
                      {headers.map((header, i) => <TableHeader key={i} >
                        {header.header}
                      </TableHeader>)}
                    </TableRow>
                  </TableDataHead>
                  {(rows && rows.length > 0) ? <TableDataBody>
                    {rows.map((row, i) => <TableRow key={i} {...getRowProps({
                      row
                    })}>
                      {row.cells.map(cell =>
                        <TableDataCell key={cell.id}>{cell.value}</TableDataCell>)}
                    </TableRow>)}
                  </TableDataBody> : <NoDataAvailable columns={headers.length} />}
                </Table>
              </TableWrapper>
            </SchoolListScroll>
          </DataTableContainer >;
        }}
      </DataTable >
      <Pagination page={page} count={count} setPage={setPageAndSize} pageSize={pageSize} />
      <ModalImportCsv
        open={openCsvModal}
        setOpen={setCsvModal} />
    </>
  )
}

export default FilesImportsList