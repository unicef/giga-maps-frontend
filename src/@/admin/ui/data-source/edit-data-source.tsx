import { Checkbox, Link, Table, TableHeader, TableRow } from '@carbon/react'
import { useStore } from 'effector-react';
import { useEffect, useMemo, useState } from 'react'
import { css, styled } from 'styled-components';


import { dataSourceFields } from '../../constants/data-source.constant';
import { getCountryDataSourceFx, getSchoolMasterListFx } from '../../effects/data-source.fx';
import { $countryDataSourceList, $schoolMasterCount, $schoolMasterData } from '../../models/data-source-model';
import CountryFilterModal from '../common-components/country-filter-modal';
import PageTitleComponent from '../common-components/page-title-component'
import Pagination from '../common-components/Pagination';
import { DataSourceListScroll, DataSourceTableCell, TableDataBody, TableDataHead, TableWrapper } from '../styles/admin-styles'
import DataSourceActionBar from './data-source-actionbar.view';
import DataSourcePreview from './data-source-preview';
import EditableField from './editable-field.view';
import { EmptyList } from '~/@/common/style/styled-component-style';
import { $userPermissions } from '~/core/auth/models';
import { DataSourceType } from '../../types/data-source.type';

const TableRowItem = styled(TableRow) <{ $isNew: boolean; $isDeleted: boolean }>`
  ${props => props.$isNew && css`
    background: #a8ccfc;
  `}
  ${props => props.$isDeleted && css`
    background: #f8d7da;
  `}
`;

const EditDataSource = () => {
  const [{ page, pageSize }, setPageAndSize] = useState({ page: 1, pageSize: 20 });
  const userPermission = useStore($userPermissions);
  const isEditable = userPermission.CAN_UPDATE_SCHOOL_MASTER_DATA || userPermission.CAN_PUBLISH_SCHOOL_MASTER_DATA;
  const [isPreview, showPreview] = useState(false);
  const dataSource = useStore($schoolMasterData);
  const countSchoolMaster = useStore($schoolMasterCount);
  const [editedData, setEditedData] = useState<Record<string, DataSourceType>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const isLoading = useStore(getSchoolMasterListFx.pending);
  const selectedRowsData = useMemo(() => {
    return dataSource.filter(item => selectedRows.includes(item.id))
  }, [selectedRows, dataSource]);
  const [showFilter, setShowFilter] = useState(false);
  const [countryFilterValues, setCountryFilterValues] = useState<number[]>([]);
  const countryList = useStore($countryDataSourceList)
  const [orderingFields, setOrderingFields] = useState<Record<string, string>>({});
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const getSchoolMasterData = () => {
    void getSchoolMasterListFx({ page, pageSize, countryIds: countryFilterValues.join(','), ordering: Object.values(orderingFields).join(','), statusFilter, search: searchValue });
  }

  useEffect(() => {
    getCountryDataSourceFx('?has_school_master_records=true');
  }, [])

  useEffect(() => {
    getSchoolMasterData();
    setSelectedRows([]);
  }, [page, pageSize, countryFilterValues, orderingFields, statusFilter, searchValue])

  const handleInputChange = (id: number, field: string, value: string, oldValue: string) => {
    setIsEditing(true);
    setEditedData((prevState) => {
      if (oldValue === value) {
        delete prevState[id][field];
        return {
          ...prevState
        }
      }
      return {
        ...prevState,
        [id]: {
          ...prevState?.[id],
          [field]: value,
        },
      };
    });
  };

  const handleRowSelect = (id: number) => {
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(id)) {
        return prevSelectedRows.filter((rowId) => rowId !== id);
      } else {
        return [...prevSelectedRows, id];
      }
    });
  };

  const handleSelectAll = () => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.length === dataSource.length ? [] : dataSource?.map((row) => row.id)
    );
  };

  return (<>
    <PageTitleComponent
      title={"Data Source"}
      subTitle={"School master data"}
      recentlyView={true} />
    <DataSourceActionBar
      isEditing={isEditing}
      isPreview={isPreview}
      showPreview={showPreview}
      editedData={editedData}
      setEditedData={setEditedData}
      setIsEditing={setIsEditing}
      selectedRowsData={selectedRowsData}
      selectedRows={selectedRows}
      setSelectedRows={setSelectedRows}
      dataSource={dataSource}
      countryFilterValues={countryFilterValues}
      showCountryFilter={() => setShowFilter(true)}
      reloadSchoolMaster={getSchoolMasterData}
      searchValue={searchValue}
      setSearchValue={(value) => {
        setPageAndSize({ page: 1, pageSize });
        setSearchValue(value)
      }}
      statusFilter={statusFilter}
      setStatusFilter={setStatusFilter}
    />
    {!isPreview ? <>
      <DataSourceListScroll>
        <TableWrapper>
          <Table aria-label="data-source-data-edit-table" >
            <TableDataHead >
              <TableRow>
                <TableHeader>
                  <Checkbox
                    labelText={selectedRows.length > 0 ? selectedRows.length : ''}
                    checked={selectedRows.length === dataSource?.length}
                    onChange={handleSelectAll}
                    id={`Select-all-checkbox-data-source`} />
                </TableHeader>
                {dataSourceFields.map((field) => <TableHeader key={field.name}>
                  {
                    field.ordering ? <Link href="#" visited={!!orderingFields[field.ordering]} onClick={() => {
                      if (!orderingFields[field.ordering]) {
                        orderingFields[field.ordering] = `${field.ordering}`;
                      } else if (orderingFields[field.ordering].startsWith('-')){
                        orderingFields[field.ordering] = '';
                      } else {
                        orderingFields[field.ordering] = `-${field.ordering}`;
                      }
                      setOrderingFields({ ...orderingFields });
                    }}>{field.name}</Link> : field.name
                  }
                </TableHeader>
                )}
              </TableRow>
            </TableDataHead>
            <TableDataBody>
              {
                dataSource?.map((item, index) => {
                  const isDeleted = item?.status === 'DELETED';
                  const props = {
                    item,
                    index,
                    updatedData: editedData,
                    handleInputChange,
                    isDeleted,
                  }
                  return (
                    <TableRowItem key={item.id} $isDeleted={isDeleted} $isNew={!item?.school} isSelected={selectedRows.includes(item.id)}>
                      <DataSourceTableCell>
                        <Checkbox labelText=""
                          checked={selectedRows.includes(item.id)}
                          onChange={() => handleRowSelect(item.id)}
                          id={`checkbox-data-source${item.id}`}
                        />
                      </DataSourceTableCell>
                      {dataSourceFields.map((field) => <EditableField key={field.keyName} {...props} readOnly={!isEditable} isEditable={field.isEditable && !isDeleted} fieldName={field.keyName} />)}
                    </TableRowItem>
                  )
                })
              }
            </TableDataBody>
          </Table >
          {!dataSource.length && !isLoading && <EmptyList $color="#000">No data found.</EmptyList>}
        </TableWrapper>
      </DataSourceListScroll>
      <Pagination page={page} count={countSchoolMaster} pageSize={pageSize} setPage={setPageAndSize} />
      <CountryFilterModal
        name="country-daily-summary"
        open={showFilter}
        updateList={(values) => {
          setPageAndSize({ page: 1, pageSize });
          setCountryFilterValues(values as number[])
        }}
        filterValues={[]}
        setOpen={setShowFilter}
        list={countryList}
      />
    </>
      : <DataSourcePreview selectedRowsData={selectedRowsData} />
    }
  </>
  )
}

export default EditDataSource




