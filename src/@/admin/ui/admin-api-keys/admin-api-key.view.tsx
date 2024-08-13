import { ActionableNotification, Table, TableBody, TableHead, TableHeader, TableRow } from '@carbon/react';
import { useStore } from 'effector-react';
import { useEffect, useState } from 'react';
import { Filter } from '@carbon/icons-react';

import { ApiKeysDataWrapper } from '~/@/api-docs/ui/components/api-keys-right-section/api-keys-right.side.style';
import { EmptyList } from '~/@/common/style/styled-component-style';

import { deleteApiKeyRequestFx, getAllApiKeyRequest } from '../../effects/api-request-fx';
import { $apiRequestListResponse, $apiRequestPageNo, onChangeApiKeyPage, reloadApiRequest } from '../../models/api-request-model';
import PageTitleComponent from '../common-components/page-title-component';
import Pagination from '../common-components/Pagination';
import { ApiKeyRequestListScroll, DeleteConfirmation, ToolbarContent } from '../styles/admin-styles';
import AdminApiKeyItem from './admin-api-key-item.view';
import { $countryList } from '~/@/api-docs/models/explore-api.model';
import SearchToolbar from '../common-components/search-toolbar';
import { TableToolbar } from '@carbon/react';
import { IconButton } from '@carbon/react';
import CountryFilterModal from '../common-components/country-filter-modal';

const AdminApiKey = () => {
  const { results: apiRequestList, count } = useStore($apiRequestListResponse) ?? {};
  const { page, pageSize } = useStore($apiRequestPageNo);
  const [apiKeyDeleteId, setApiKeyDeleteId] = useState<null | number>(null);
  const countryList = useStore($countryList)
  const [searchValue, setSearchValue] = useState('')
  const [showFilter, setShowFilter] = useState(false);
  const [countryFilterValues, setCountryFilterValues] = useState<number[]>([]);

  const getApiKeyRequest = () => {
    void getAllApiKeyRequest({ page, pageSize, countryIds: countryFilterValues.join(','), search: searchValue })
  }

  useEffect(() => {
    getApiKeyRequest();
  }, [page, pageSize, countryFilterValues, searchValue])

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
      <TableToolbar>
        <ToolbarContent>
          <SearchToolbar placeholder="Search by API name, user" onSearchChange={setSearchValue} />
          <IconButton label="Country filter" kind="ghost" renderIcon={Filter} onClick={() => setShowFilter(!showFilter)} />
        </ToolbarContent>
      </TableToolbar>
      {apiKeyDeleteId &&
        <DeleteConfirmation>
          <ActionableNotification
            style={{ maxWidth: "100%" }}
            lowContrast inline
            title="Delete Api Key - "
            subtitle="Are you sure?"
            closeOnEscape
            actionButtonLabel="Yes"
            onActionButtonClick={() => void onDeleteApiKey(apiKeyDeleteId)}
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
        {!(apiRequestList?.length) &&
          <EmptyList>
            No data found
          </EmptyList>}
      </ApiKeyRequestListScroll>
      <Pagination page={page} pageSize={pageSize} count={count} setPage={({ page, pageSize }) => onChangeApiKeyPage({ page, pageSize })} />
      <CountryFilterModal
        name="country-daily-summary"
        open={showFilter}
        updateList={(values) => {
          setCountryFilterValues(values as number[])
        }}
        filterValues={[]}
        setOpen={setShowFilter}
        list={countryList}
      />
    </div >
  )
}

export default AdminApiKey