import { ActionableNotification, Table, TableBody, TableHead, TableHeader, TableRow } from '@carbon/react';
import { useStore } from 'effector-react';
import { useEffect, useState } from 'react';

import { ApiKeysDataWrapper } from '~/@/api-docs/ui/components/api-keys-right-section/api-keys-right.side.style';
import { EmptyList } from '~/@/common/style/styled-component-style';

import { deleteApiKeyRequestFx } from '../../effects/api-request-fx';
import { $apiRequestListResponse, $apiRequestPageNo, onChangeApiKeyPage, reloadApiRequest } from '../../models/api-request-model';
import PageTitleComponent from '../common-components/page-title-component';
import Pagination from '../common-components/Pagination';
import { ApiKeyRequestListScroll, DeleteConfirmation } from '../styles/admin-styles';
import AdminApiKeyItem from './admin-api-key-item.view';
import { $countryList } from '~/@/api-docs/models/explore-api.model';

const AdminApiKey = () => {
  const { results: apiRequestList, count } = useStore($apiRequestListResponse) || {};
  const { page, pageSize } = useStore($apiRequestPageNo);
  const [deleteId, setApiKeyDeleteId] = useState<null | number>(null);
  const countryList = useStore($countryList)

  useEffect(() => {
    reloadApiRequest();
  }, [])

  const onDeleteApiKey = async (id: number) => {
    setApiKeyDeleteId(null);
    try {
      await deleteApiKeyRequestFx({ id })
    } catch (e) { console.error(e) }
  }

  return (
    <div>
      <PageTitleComponent
        title={"Api Keys Requests"}
        subTitle={"List of Api Keys"}
        recentlyView={true}
        onRefresh={() => reloadApiRequest()}
      />
      {deleteId &&
        <DeleteConfirmation>
          <ActionableNotification
            style={{ maxWidth: "100%" }}
            lowContrast inline
            title="Delete Api Key - "
            subtitle="Are you sure?"
            closeOnEscape
            actionButtonLabel="Yes"
            onActionButtonClick={() => void onDeleteApiKey(deleteId)}
            onClose={() => setApiKeyDeleteId(null)}
          />
        </DeleteConfirmation>
      }
      <ApiKeyRequestListScroll>
        <ApiKeysDataWrapper>
          <Table aria-label="api-keys-data-table">
            <TableHead>
              <TableRow>
                <TableHeader>
                  API Name
                </TableHeader>
                <TableHeader>
                  User
                </TableHeader>
                <TableHeader>
                  Country
                </TableHeader>
                <TableHeader>
                  Valid till
                </TableHeader>
                <TableHeader>
                  Status
                </TableHeader>
                <TableHeader>
                  Extension Status
                </TableHeader>
                <TableHeader>
                  Action
                </TableHeader>
                <TableHeader>

                </TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {apiRequestList?.map((item) => <AdminApiKeyItem key={item.id} item={item} setApiKeyDeleteId={setApiKeyDeleteId} countryLength={countryList?.length} />)}
            </TableBody>
          </Table>
        </ApiKeysDataWrapper>
        {(!apiRequestList || !apiRequestList?.length) &&
          <EmptyList>
            No data found
          </EmptyList>}
      </ApiKeyRequestListScroll>
      <Pagination page={page} pageSize={pageSize} count={count} setPage={({ page, pageSize }) => onChangeApiKeyPage({ page, pageSize })} />
    </div >
  )
}

export default AdminApiKey