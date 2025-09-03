import { Button, OverflowMenu, OverflowMenuItem, RadioButton, RadioButtonGroup, TableCell, TableRow, ToggletipButton, Tooltip } from '@carbon/react';
import { useStore } from 'effector-react';
import { Information } from '@carbon/icons-react'
import { ApiStatusColors, ApiStatusName } from '~/@/api-docs/api-docs.constant';
import { ActionButtonWrapper, DateWrapper, StatusWrapper } from '~/@/api-docs/ui/components/api-keys-right-section/api-keys-right.side.style';
import { getApiKeysProps } from '~/@/api-docs/utils/api-keys.utis';
import { $userPermissions } from '~/core/auth/models';

import { updateApiKeyExtensionFx } from '../../effects/api-request-fx';
import { onChangeApiKeyRequest } from '../../models/api-request-model';
import { ApiKeysAdminRequestType } from '../../types/api-request.type';
import { CountryListToggletip, DataLayerActiveCountries, CountryListToggletipContent } from '../styles/admin-styles';
import { Div } from '~/@/common/style/styled-component-style';
import ApiCategorySelection from './api-category-selection.view';


const AdminApiKeyItem = ({ item, setApiKeyDeleteId, countryLength, refresh }: { item: ApiKeysAdminRequestType, setApiKeyDeleteId: any, countryLength: number, refresh: () => void }) => {
  const { inProgress, isExpired, extensionInProgress, extensionDeclined } = getApiKeysProps(item);
  const currentStatusType = (isExpired ? ApiStatusName.expired : item.status).toLocaleLowerCase();
  const statusColor = ApiStatusColors[currentStatusType];
  const statusName = ApiStatusName[currentStatusType];
  const extensionName = ApiStatusName[item.extension_status?.toLocaleLowerCase()]
  const extensionColor = ApiStatusColors[item.extension_status?.toLocaleLowerCase()]
  const isExtension = extensionInProgress ?? extensionDeclined;
  const userPermission = useStore($userPermissions);
  const isAllCountries = item?.active_countries_list?.length === countryLength;
  const apiAction = (status: string) => {
    onChangeApiKeyRequest({
      id: item.id,
      body: {
        status
      }
    })
  }

  const extensionAction = (status: string) => {
    void updateApiKeyExtensionFx({
      id: item.id,
      body: {
        extension_status: status
      }
    })
  }
  const hasOneCountry = item?.active_countries_list?.length === 1;
  return (
    <TableRow>
      <TableCell className='api-keys-data-table-key-name'>
        {item.api.name}
        <span> ({item.api.category})</span>
      </TableCell>
      <TableCell>
        {item.user.first_name}<br />{item.user.email}
      </TableCell>
      <TableCell className='api-keys-data-table-key-name'>
        <Div $flex="center">
          {item?.active_countries_list?.length === 0 && '-'}
          {hasOneCountry && item?.active_countries_list[0].name}
          {item?.active_countries_list?.length > 1 && item?.active_countries_list?.length}
          {item?.active_countries_list?.length >= 1 && <CountryListToggletip
            align="bottom">
            <ToggletipButton>
              <DataLayerActiveCountries>
                {!hasOneCountry && "View list"}
                <Tooltip align="bottom" label={item?.description}>
                  <button className="sb-tooltip-trigger" type="button">
                    <Information style={{ fill: '#000' }} />
                  </button>
                </Tooltip>
              </DataLayerActiveCountries>
            </ToggletipButton>
            {!hasOneCountry && <CountryListToggletipContent>
              <p className="list-content">
                {isAllCountries ? 'All countries' : item.active_countries_list?.map((country) => country?.name)?.join(', ')}
              </p>
            </CountryListToggletipContent>}
          </CountryListToggletip>}
        </Div>
      </TableCell>
      <TableCell>
        <ApiCategorySelection item={item} refresh={refresh} isExpired={isExpired} />
      </TableCell>
      < TableCell>
        <DateWrapper>
          {item.valid_to}
        </DateWrapper>
      </TableCell>
      <TableCell>
        <StatusWrapper color={statusColor}>{statusName}</StatusWrapper>
      </TableCell>
      <TableCell>
        {isExtension && <>
          <b>{item.extension_valid_to}</b>
          <StatusWrapper color={extensionColor}>{extensionName}</StatusWrapper>
        </>
        }
      </TableCell>
      <TableCell className="api-keys-data-table-over-flow-menu">
        {(inProgress || extensionInProgress) &&
          <>
            {userPermission.CAN_APPROVE_REJECT_API_KEY &&
              <ActionButtonWrapper>
                <Button
                  size='sm'
                  kind="ghost"
                  onClick={() => {
                    if (extensionInProgress) {
                      extensionAction('APPROVED')
                    } else {
                      apiAction('APPROVED');
                    }
                  }}>
                  Approve
                </Button>
                <Button
                  kind="ghost"
                  size='sm'
                  onClick={() => {
                    if (extensionInProgress) {
                      extensionAction('DECLINED')
                    } else {
                      apiAction('DECLINED');
                    }
                  }}>
                  Reject
                </Button>
              </ActionButtonWrapper>
            }
          </>
        }
      </TableCell>
      <TableCell className="api-keys-data-table-over-flow-menu">
        {userPermission.CAN_DELETE_API_KEY &&
          <OverflowMenu aria-label="overflow-menu" flipped={true}>
            <OverflowMenuItem onClick={() => {
              setApiKeyDeleteId(item.id)
            }} title="Delete" itemText="Delete" />
          </OverflowMenu>
        }
      </TableCell>
    </TableRow>
  )
}

export default AdminApiKeyItem;