import { Replicate, } from '@carbon/icons-react';
import { CopyButton, IconButton, OverflowMenu, OverflowMenuItem, TableCell, TableRow, ToggletipButton } from '@carbon/react';

import { ApiStatusColors, ApiStatusName } from '~/@/api-docs/api-docs.constant';
import { onRequestExtensionPopup } from '~/@/api-docs/models';
import { ApiKeysType } from '~/@/api-docs/types/api-keys.type';
import { getApiKeysProps } from '~/@/api-docs/utils/api-keys.utis';

import { StatusWrapper } from './api-keys-right.side.style';
import styled from 'styled-components';
import { CountryListToggletip, CountryListToggletipContent, DataLayerActiveCountries } from '~/@/admin/ui/styles/admin-styles';
import { useStore } from 'effector-react';
import { $userPermissions } from '~/core/auth/models';

const copyToClipboard = (text: string) => {
  void navigator.clipboard.writeText(text);
}

const OverflowMenuCustomItem = styled(OverflowMenuItem)`
  .cds--overflow-menu-options {
    inline-size: 100%;
  }
`

const ApiKeyItem = ({ item: apiItem, countryLength, setApiKeyDeleteId }: { item: ApiKeysType, countryLength: number, setApiKeyDeleteId: (any) }) => {
  const { isApproved, inProgress, isExpired, extensionInProgress, extensionDeclined, hasExtensionRequest } = getApiKeysProps(apiItem);
  const currentStatusType = (isExpired ? ApiStatusName.expired : apiItem.status).toLocaleLowerCase();
  const extensionStatusType = (isExpired ? ApiStatusName.expired : apiItem.extension_status || "").toLocaleLowerCase();
  const statusColor = ApiStatusColors[currentStatusType];
  const statusName = ApiStatusName[currentStatusType];
  const extensionName = ApiStatusName[extensionStatusType]
  const extensionColor = ApiStatusColors[extensionStatusType]
  const isExtension = extensionInProgress || extensionDeclined;
  const isAllCountries = apiItem?.active_countries_list?.length === countryLength;
  const userPermission = useStore($userPermissions);

  return (
    <TableRow key={apiItem.id}>
      <TableCell className='api-keys-data-table-key-name'>
        {apiItem.api.name}
      </TableCell>
      <TableCell className='api-keys-data-table-key-name'>
        {apiItem?.active_countries_list.length === 0 && '-'}
        {apiItem?.active_countries_list.length === 1 && apiItem?.active_countries_list[0].name}
        {apiItem?.active_countries_list.length > 1 && apiItem?.active_countries_list.length}
        {apiItem?.active_countries_list?.length > 1 && <CountryListToggletip
          align="bottom">
          <ToggletipButton>
            <DataLayerActiveCountries>
              View list
            </DataLayerActiveCountries>
          </ToggletipButton>
          <CountryListToggletipContent>
            <p className="list-content">
              {isAllCountries ? 'All countries' : apiItem.active_countries_list?.map((country) => country?.name)?.join(', ')}
            </p>
          </CountryListToggletipContent>
        </CountryListToggletip>}
      </TableCell>
      <TableCell className='api-keys-data-table-key'>
        {isApproved &&
          <div className="api-keys-data-table-row" >
            <p >{apiItem.api_key}</p>
            <CopyButton align="bottom" className='copy-button' iconDescription="Copy" onClick={() => copyToClipboard(apiItem.api_key)} />
          </div>}
      </TableCell>
      <TableCell className='api-keys-data-table-key-country'>
        <StatusWrapper color={statusColor}>{statusName}</StatusWrapper>
      </TableCell>
      <TableCell className="api-keys-data-table-validity">
        {!inProgress ? <span>{apiItem.valid_to}</span> : '-'}
      </TableCell >
      <TableCell className='api-keys-data-table-key-country'>
        {hasExtensionRequest ? <>
          <StatusWrapper color={extensionColor}>{extensionName}</StatusWrapper>
          {isExtension && <span><b>{apiItem.extension_valid_to}</b></span>}
        </> : <span>-</span>}
      </TableCell>
      <TableCell className="api-keys-data-table-over-flow-menu">
        <OverflowMenu aria-label="overflow-menu" flipped={true}>
          {isApproved && <OverflowMenuCustomItem disabled={extensionInProgress} onClick={() => {
            onRequestExtensionPopup(apiItem.id);
          }} requireTitle={true} title="Request for extension" itemText="Request for extension" />}
          {(userPermission.CAN_DELETE_API_KEY && <OverflowMenuItem onClick={() => {
            setApiKeyDeleteId(apiItem.id)
          }} title="Delete" itemText="Delete" />)}
        </OverflowMenu>
      </TableCell>
    </TableRow >

  )
}

export default ApiKeyItem;