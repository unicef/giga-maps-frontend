import { Filter, Information, Search } from '@carbon/icons-react';
import { Button, IconButton, TableToolbarAction, TableToolbarMenu, TableToolbarSearch, Toggletip, ToggletipButton, ToggletipContent } from "@carbon/react";
import { useStore } from "effector-react";
import { styled } from 'styled-components';

import { $userPermissions } from "~/core/auth/models";

import { deleteSchoolMasterFx, publishAllSchoolMasterFx, publishSchoolMasterFx, updateSchoolMasterFx } from "../../effects/data-source.fx";
import { DataSourceType } from '../../types/data-source.type';
import { ActionButtonWrapper, StatusWrapperDataSource } from "../styles/admin-styles";
import { Chip, Div, Text } from '~/@/common/style/styled-component-style';
import { useMemo, useState } from 'react';
import { AlertModalWithButton } from '../common/alert-modal.view';

interface ActionBarType {
  readonly setSelectedRows: React.Dispatch<React.SetStateAction<number[]>>;
  readonly isEditing: boolean;
  readonly showPreview: React.Dispatch<React.SetStateAction<boolean>>,
  readonly setEditedData: React.Dispatch<React.SetStateAction<Record<string, any>>>,
  readonly setIsEditing: (a: boolean) => void,
  readonly selectedRows: number[],
  readonly isPreview: boolean,
  readonly selectedRowsData: DataSourceType[],
  readonly editedData: Record<string, DataSourceType>
  readonly dataSource: DataSourceType[]
  readonly showCountryFilter: () => void;
  readonly countryFilterValues: number[];
  readonly reloadSchoolMaster: () => void;
  readonly searchValue: string;
  readonly setSearchValue: React.Dispatch<React.SetStateAction<string>>
  readonly statusFilter: string;
  readonly setStatusFilter: React.Dispatch<React.SetStateAction<string>>
}

const statusList = [{
  name: 'All',
  value: '',
}, {
  name: 'In Draft',
  value: 'DRAFT',
}, {
  name: 'Updated By Editor',
  value: 'UPDATED_IN_DRAFT',
}, {
  name: 'Assigned to Publisher',
  value: 'DRAFT_LOCKED',
}, {
  name: 'Updated by publisher',
  value: 'UPDATED_IN_DRAFT_LOCKED',
}, {
  name: 'Deleted',
  value: 'DELETED'
}]
const ToolTipCustom = styled(Toggletip)`
  margin-left: 0.5rem;

  svg {
    fill: #222; 
  }
  p {
    color: #fff;
  }
  ul {
    list-style: disc;
    margin-left: 1rem;
  }
  .cds--popover-content {
    max-inline-size: 38rem;
  }
  .cds--toggletip-content {
    max-inline-size: 38rem;
  }
`;

const TableToolbarSearchCustom = styled(TableToolbarSearch)`
  .cds--search-magnifier-icon {
    fill: #222;
    margin-left: -1rem;
  }
`

export default function DataSourceActionBar({ selectedRowsData, searchValue, setSearchValue, statusFilter, setStatusFilter, reloadSchoolMaster, countryFilterValues, dataSource, setSelectedRows, isEditing, showPreview, setEditedData, setIsEditing, selectedRows, isPreview, editedData, showCountryFilter }: ActionBarType): JSX.Element {
  const permissions = useStore($userPermissions)
  const isPublisher = permissions.CAN_PUBLISH_SCHOOL_MASTER_DATA;
  const isEditor = permissions.CAN_UPDATE_SCHOOL_MASTER_DATA && !isPublisher;
  const [searchType, setSearchType] = useState(searchValue);

  const handleCancel = () => {
    setEditedData({});
    setIsEditing(false);
  };

  const afterUpdatedData = () => {
    reloadSchoolMaster();
    setIsEditing(false);
    setEditedData({});
    setSelectedRows([]);
  }

  const handleSave = async () => {
    const dataEntries = Object.entries(editedData);
    try {
      await updateSchoolMasterFx({
        body: dataEntries.map(([id, data]) => ({
          id,
          ...data,
          status: isPublisher ? 'UPDATED_IN_DRAFT_LOCKED' : 'UPDATED_IN_DRAFT'
        }))
      })
      afterUpdatedData();
    } catch (e) {
      console.log('failed updating school data')
    }
  };


  const handlePublishRequest = async () => {
    try {
      await updateSchoolMasterFx({
        body: selectedRows.map(id => ({ id, status: 'DRAFT_LOCKED' }))
      })
      afterUpdatedData();
    } catch (e) {
      console.log('error: publish request')
    }
  };

  const handlePublishAll = async () => {
    try {
      await publishAllSchoolMasterFx({
        body: countryFilterValues.map(id => ({ country_id: id }))
      })
      afterUpdatedData();
    } catch (e) {
      console.log('error: publish all')
    }
  };

  const handlePublish = async (ids: { id: number }[]) => {
    try {
      await publishSchoolMasterFx({
        body: ids
      })
      afterUpdatedData();
    } catch (e) {
      console.log('error: publish')
    }
  };

  const discardRecords = async (ids: { id: number }[]) => {
    try {
      await deleteSchoolMasterFx({
        body: ids
      })
      afterUpdatedData();
    } catch (e) {
      console.log('error: publish')
    }
  };

  const deletedIds = useMemo(() => selectedRowsData?.filter(item => item.status === 'DELETED') ?? [], [selectedRowsData])
  return <ActionButtonWrapper>
    <div className="action-button">
      {!!(dataSource?.length) &&
        <StatusWrapperDataSource>
          Updates available
        </StatusWrapperDataSource>
      }
      <ToolTipCustom align='bottom-left'>
        <ToggletipButton label="Additional information">
          <Information />
        </ToggletipButton>
        <ToggletipContent>
          <p>
            Editors and publishers are able to access the updated data for preview and publish.
          </p>
          <p>
            For existing schools, when values are updated for Latitude (Lat), Longitude (Long), Admin 1, Admin 2, School Name, School Id Gov, School Giga Id , Education Level, those schools are assigned to editors and publishers for preview and publish.
          </p>
          <p>
            When a new school is added to the data source for the first time, those new schools are assigned to editors and publishers for preview and publish.
          </p>
          <p>
            The following are the statuses that are shown to editors and publishers:
          </p>
          <ul>
            <li><b>In Draft</b>: When new or existing school data is sent from the data source for preview and publish.</li>
            <li><b>Updated By Editor</b>: When details of any school are updated by the editor. </li>
            <li><b>Assigned to Publisher</b>: When the editor sends a school to the publisher for preview and publish. </li>
            <li><b>Updated by Publisher</b>: When details of any school are updated by the publisher. </li>
            <li><b>Deleted</b>: When school details are deleted.</li>
            {/* <li><b>Published</b>: When school details are published by the publisher. </li> */}
          </ul>
        </ToggletipContent>
      </ToolTipCustom>
    </div>
    <div className='action-button right-action-button'>
      {!isPreview && <>
        <form style={{ flex: 1, display: 'flex' }} onSubmit={(e) => {
          e.preventDefault();
          setSearchValue(searchType);
        }}>
          <TableToolbarSearchCustom
            expanded={true}
            placeholder="Search by giga id, school name"
            defaultValue={searchValue}
            onClear={() => {
              setSearchValue('');
              setSearchType('');
            }}
            onChange={(evt) => {
              setSearchType(evt?.target?.value ?? '');
            }} />
          <IconButton
            kind="secondary"
            type="submit"
          >
            <Search />
          </IconButton>
        </form>
        {countryFilterValues?.length > 0 && <Div $margin="0 -1rem 0 0">
          <Chip style={{ marginTop: '-10px' }}>{countryFilterValues?.length}</Chip>
        </Div>}
        <IconButton label="Country filter" kind="ghost" renderIcon={Filter} onClick={() => showCountryFilter()} />
        {statusFilter && <Div $margin="0 -1rem 0 0" style={{ position: 'relative', zIndex: 10 }}>
          <Chip style={{ marginTop: '-10px' }}>1</Chip>
        </Div>}
        <TableToolbarMenu iconDescription="Status filter">
          {statusList.map((item) => <TableToolbarAction title={item.value} key={item.value} onClick={() => setStatusFilter(item.value)}>
            <Text $color={statusFilter === item.value ? '#277AFF' : 'inherit'}>{item.name}</Text>
          </TableToolbarAction>
          )}
        </TableToolbarMenu>
      </>}
      <Button disabled={selectedRows.length === 0}
        onClick={() => showPreview((prev) => !prev)}
        kind='tertiary'
      >{isPreview ? 'Cancel' : 'Map'} Preview</Button>
      {!isPreview && <>
        {isEditing && (isPublisher || isEditor) &&
          <div>
            <Button kind="ghost" onClick={handleCancel}>Cancel</Button>
            <Button kind="secondary" onClick={() => {
              void handleSave();
            }}>Save</Button>
          </div>
        }
        {isEditor &&
          <Button disabled={selectedRows.length === 0}
            onClick={() => {
              void handlePublishRequest()
            }}
          >Send publish request</Button>
        }
        {isPublisher && <AlertModalWithButton
          buttonProps={{
            title: 'Publish',
            disabled: selectedRows.length === 0 || dataSource.length === 0,
          }}
          modalProps={{
            modalHeading: `Are you sure you want to publish ${selectedRows.length - deletedIds.length} schools?`,
            note: deletedIds.length ? `${deletedIds.length} schools will be deleted from the school table.` : '',
            modalLabel: "Publish schools",
            primaryButtonText: "Publish",
            secondaryButtonText: "Cancel",
          }}
          confirm={() => handlePublish(selectedRows?.map(id => ({ id })))}
        />
          // <Button disabled={selectedRows.length === 0}
          //   onClick={() => {
          //     void handlePublish(selectedRows?.map(id => ({ id })))
          //   }
          //   }
          // >Publish</Button>
        }
        {isPublisher && countryFilterValues?.length > 0 && <AlertModalWithButton
          buttonProps={{
            title: 'Publish all',
            disabled: dataSource.length === 0,
          }}
          modalProps={{
            modalHeading: "Are you sure you want to publish all schools in selected countries?",
            modalLabel: "Publish schools",
            primaryButtonText: "Publish",
            secondaryButtonText: "Cancel",
          }}
          confirm={handlePublishAll}
        />
        }
        {isPublisher && deletedIds.length > 0 &&
          <Button kind="danger--tertiary"
            onClick={() => {
              void discardRecords(deletedIds?.map(item => ({ id: item.id }))) // only deleted
            }}
          >Discard ({deletedIds.length})</Button>
        }
      </>}
    </div>
  </ActionButtonWrapper >
}