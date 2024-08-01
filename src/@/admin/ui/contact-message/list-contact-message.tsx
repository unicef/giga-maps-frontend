import { TrashCan, View } from '@carbon/icons-react';
import {
  ActionableNotification,
  Button,
  DataTable,
  Table, TableBatchAction,
  TableBatchActions,
  TableHeader, TableRow,
  TableSelectAll,
  TableSelectRow,
  TableToolbar,
  TableToolbarSearch
} from '@carbon/react'
import { useStore } from 'effector-react';
import { FormEvent, useEffect, useState } from 'react';

import { contactMessageView } from '~/core/routes';
import { Link } from '~/lib/router';

import { deleteContactMessageFx, getContactMessageListFx } from '../../effects/contact-message-fx';
import { $constactMessageList } from '../../models/contact-message.model';
import NoDataAvailable from '../common-components/no-data-available';
import PageTitleComponent from '../common-components/page-title-component'
import Pagination from '../common-components/Pagination';
import {
  BackgroundTasktScroll,
  DataTableContainer, DeleteConfirmation, TableDataBody, TableDataCell, TableDataHead, TableWrapper, ToolbarContent
} from '../styles/admin-styles'

const headers = [
  { key: 'full_name', header: "Full Name" },
  { key: 'purpose', header: "Purpose" },
  { key: 'organisation', header: "Organization" },
  { key: 'created', header: "Created" },
  { key: 'message', header: "Message" },
  { key: 'action', header: "View Details" },
]

const AdminContactMessage = () => {

  const { results: contactMessageList, count } = useStore($constactMessageList) ?? {};

  const rows = contactMessageList ? contactMessageList?.map((contactMessage) => ({
    ...contactMessage,
    action: <Link to={contactMessageView} params={{ id: contactMessage.id }} data-testid={`contact-message-view-${contactMessage.id}`}><View /></Link>,

  })) : []

  const [{ page, pageSize }, setPageAndSize] = useState({ page: 1, pageSize: 20 });
  const [searchValue, setSearchValue] = useState('');
  const [searchApiCall, setSearchApiCall] = useState(false)
  const [deleteId, setDeleteId] = useState<null | number[]>(null);

  const deleteContactMessage = async (deleteIds) => {
    setDeleteId(null)
    const body = {
      id: [...deleteIds]
    }
    try {
      await deleteContactMessageFx({
        body,
      })
      void getContactMessageListFx({ page, pageSize, search: searchValue, })
    }
    catch (e) {
      console.log(e)
    }
  }

  const batchActionClick = (selectedRows: unknown) => {
    const selectedId = selectedRows?.map(item => item.id);
    setDeleteId(selectedId)
  };

  useEffect(() => {
    void getContactMessageListFx({ page, pageSize, search: searchValue, })
  }, [page, pageSize, searchApiCall])

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
      <PageTitleComponent
        title={"Contact Message"}
        subTitle={"List of Contact Message"}
        recentlyView={false} />
      {deleteId &&
        <DeleteConfirmation>
          <ActionableNotification
            style={{ maxWidth: "100%" }}
            lowContrast inline
            title="Delete Contact Message - "
            subtitle="Are you sure?"
            closeOnEscape
            actionButtonLabel="Yes"
            onActionButtonClick={() => void deleteContactMessage(deleteId)}
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
              </ToolbarContent>
            </TableToolbar>
            <BackgroundTasktScroll >
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
                  {(rows && rows.length > 0) ? <TableDataBody>
                    {rows.map((row, i) => <TableRow key={`${row.id}-${i}`} {...getRowProps({
                      row
                    })}>
                      <TableSelectRow
                        {...getSelectionProps({ row })} />
                      {row.cells.map(cell =>
                        <TableDataCell key={cell.id}>{cell.value}</TableDataCell>)}
                    </TableRow>)}
                  </TableDataBody> :
                    <NoDataAvailable columns={headers.length + 1} />
                  }
                </Table>
              </TableWrapper>
            </BackgroundTasktScroll>
          </DataTableContainer>;
        }}
      </DataTable>
      <Pagination page={page} count={count} pageSize={pageSize} setPage={setPageAndSize} />
    </>
  )
}

export default AdminContactMessage