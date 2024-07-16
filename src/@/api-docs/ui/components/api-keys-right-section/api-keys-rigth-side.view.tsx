import { ActionableNotification, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@carbon/react';
import { useStore } from 'effector-react';
import { useEffect, useState } from 'react';

import { getApiKeyListFx } from '~/@/api-docs/effects/api-keys-fx';
import { $apiKeysListResponse } from '~/@/api-docs/models/api-keys.model';
import { EmptyList } from '~/@/common/style/styled-component-style';
import { Scroll } from '~/@/scroll';
import { $isLoggedIn, $loggedInUser } from '~/core/auth/models';

import RightSectonHeader from '../common/right-section-header/right-section-header';
import ApiKeyItem from './api-key-item.view';
import { ApiKeysDataWrapper } from './api-keys-right.side.style';
import { $countryList } from '~/@/api-docs/models/explore-api.model';
import Pagination from '~/@/admin/ui/common-components/Pagination';
import { deleteApiKeyRequestFx } from '~/@/admin/effects/api-request-fx';
import { DeleteConfirmation } from '~/@/admin/ui/styles/admin-styles';

const ApiKeysRigthSide = () => {
  const isLoggedIn = useStore($isLoggedIn);
  const { results: apiKeyList, count } = useStore($apiKeysListResponse) || {};
  const user = useStore($loggedInUser);
  const countryList = useStore($countryList)
  const [{ page, pageSize }, setPageAndSize] = useState({ page: 1, pageSize: 20 });
  const [deleteId, setApiKeyDeleteId] = useState<null | number>(null);

  useEffect(() => {
    if (isLoggedIn && user) {
      void getApiKeyListFx({ userId: user?.id, page, pageSize })
    }
  }, [isLoggedIn && user, page, pageSize])

  const onDeleteApiKey = async (id: number) => {
    setApiKeyDeleteId(null);
    try {
      await deleteApiKeyRequestFx({ id })
      getApiKeyListFx({ userId: user?.id, page, pageSize })
    } catch (e) { console.error(e) }
  }
  
  return (
    <>
      <RightSectonHeader
        title="API Keys"
        description="These Keys will allow to authenticate API request"
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
      <Scroll style={{ maxHeight: "calc(100vh - 9rem)" }}>
        <ApiKeysDataWrapper>
          <Table aria-label="api-keys-data-table">
            <TableHead>
              <TableRow>
                <TableHeader>
                  Name
                </TableHeader>
                <TableHeader>
                  Country
                </TableHeader>
                <TableHeader>
                  Key
                </TableHeader>
                <TableHeader>
                  Status
                </TableHeader>
                <TableHeader>
                  Valid till
                </TableHeader>
                <TableHeader>
                  Extension status
                </TableHeader>
                <TableHeader>
                </TableHeader>
              </TableRow>
            </TableHead>
            <TableBody >
              {
                apiKeyList?.map((item) => <ApiKeyItem key={item.id} item={item} countryLength={countryList?.length} setApiKeyDeleteId={setApiKeyDeleteId} />)
              }
            </TableBody>
          </Table>
          {(!apiKeyList || !apiKeyList?.length) &&
            <EmptyList>
              No data found
            </EmptyList>}
        </ApiKeysDataWrapper>
      </Scroll>
      <Pagination page={page} count={count} pageSize={pageSize} setPage={setPageAndSize} />
    </>
  )
}

export default ApiKeysRigthSide