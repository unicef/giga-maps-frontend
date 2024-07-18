import { TrashCan, View } from '@carbon/icons-react';
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
  TableToolbarSearch
} from '@carbon/react';
import { useStore } from 'effector-react';
import { useEffect, useState } from 'react';

import { backgroundTaskView } from '~/core/routes';
import { Link } from '~/lib/router';

import { deleteBackgroundTaskFx, getBackgroundTaskListFx } from '../../effects/background-task-fx';
import { $backgroundTaskList, BackgroundTaskGate } from '../../models/background-task-model';
import NoDataAvailable from '../common-components/no-data-available';
import PageTitleComponent from '../common-components/page-title-component';
import Pagination from '../common-components/Pagination';
import {
  BackgroundTasktScroll,
  DataTableContainer, DeleteConfirmation, TableDataBody, TableDataCell, TableDataHead, TableWrapper, ToolbarContent,
} from '../styles/admin-styles'


const headers = [
  { key: 'task_id', header: 'Task Id' },
  { key: 'description', header: 'Description' },
  { key: 'status', header: 'Status' },
  { key: 'created_at', header: 'Created At' },
  { key: 'completed_at', header: 'Completed At' },
  { key: 'viewDetails', header: 'View Details' }
];

const AdminBackgroundTask = () => {

  const { results: backgroundTaskList, count } = useStore($backgroundTaskList) ?? {};
  const rows = backgroundTaskList ? backgroundTaskList?.map((backgroundTask) => ({
    ...backgroundTask,
    viewDetails: <Link to={backgroundTaskView} params={{ id: backgroundTask.task_id }} data-testid={`background-task-view${backgroundTask.task_id}`} > <View /></Link >,
    id: backgroundTask.task_id
  })) : []

  const [{ page, pageSize }, setPageAndSize] = useState({ page: 1, pageSize: 20 });
  const [searchValue, setSearchValue] = useState('');
  const [searchApiCall, setSearchApiCall] = useState(false)
  const [deleteId, setDeleteId] = useState<null | number[]>(null);

  const deleteBackgroundTask = async (deleteIds) => {
    setDeleteId(null)
    const body = {
      task_id: [...deleteIds]
    }
    try {
      await deleteBackgroundTaskFx({
        body,
      })
      void getBackgroundTaskListFx({ page, pageSize, search: searchValue, })
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
    void getBackgroundTaskListFx({ page, pageSize, search: searchValue, })
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
        title={"Background Task"}
        subTitle={"List of Background Task"}
        recentlyView={false}
      />
      {deleteId &&
        <DeleteConfirmation>
          <ActionableNotification
            style={{ maxWidth: "100%" }}
            lowContrast inline
            title="Delete Background Task - "
            subtitle="Are you sure?"
            closeOnEscape
            actionButtonLabel="Yes"
            onActionButtonClick={() => void deleteBackgroundTask(deleteId)}
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
                  </TableDataBody>
                    : <NoDataAvailable columns={headers.length + 1} />
                  }
                </Table>
              </TableWrapper>
            </BackgroundTasktScroll>
          </DataTableContainer>;
        }}
      </DataTable>
      <BackgroundTaskGate page={page} />
      <Pagination page={page} count={count} pageSize={pageSize} setPage={setPageAndSize} />
    </>
  );
};

export default AdminBackgroundTask;


