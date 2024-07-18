import { Add } from '@carbon/icons-react';
import { Button, Table, TableHeader, TableRow, ToggletipButton } from '@carbon/react'
import { useStore } from 'effector-react';
import { useEffect, useState } from 'react'

import { $countryList } from '~/@/api-docs/models/explore-api.model';
import { StatusWrapper } from '~/@/api-docs/ui/components/api-keys-right-section/api-keys-right.side.style';
import { $userPermissions } from '~/core/auth/models';
import { addGigaLayer, viewGigaLayer } from '~/core/routes';
import { Link } from '~/lib/router';
import { DataSourceStatusChoices, DataSourceStatusNames } from '../../constants/giga-layer.constant';
import { $dataLayerListResponce, $dataListLayerCount, onGetDataLayerList } from '../../models/giga-layer.model';
import PageTitleComponent from '../common-components/page-title-component'
import Pagination from '../common-components/Pagination';
import { AdminTableScroll, CountryListToggletip, CountryListToggletipContent, DataLayerActiveCountries, SearchContainer, TableDataBody, TableDataCell, TableDataHead, TableWrapper } from '../styles/admin-styles'

const ListGigaLayer = () => {
  const dataLayerList = useStore($dataLayerListResponce)
  const count = useStore($dataListLayerCount);
  const [{ page, pageSize }, setPageAndSize] = useState({ page: 1, pageSize: 20 });
  const countryList = useStore($countryList)
  const userPermission = useStore($userPermissions);
  const isEditor = userPermission.CAN_ADD_DATA_LAYER;
  useEffect(() => {
    onGetDataLayerList({ page, pageSize })
  }, [page, pageSize])

  const getCountryName = (activeCountriesIds: number[]) => {
    const activeCountries = countryList.filter(item => activeCountriesIds.includes(item.id));
    return activeCountries
  }

  return (
    <>
      <PageTitleComponent
        title={"Giga layer"}
        subTitle={"List of giga layer"}
        recentlyView={false} />
      <SearchContainer>
        <Link to={addGigaLayer}>
          <Button
            renderIcon={Add}
            onClick={() => { }}
            disabled={!isEditor}
          >
            Add new layer
          </Button>
        </Link>
      </SearchContainer>
      <AdminTableScroll $contentHeight="13.2rem">
        <TableWrapper>
          <Table aria-label="data-layer-list-data-table" >
            <TableDataHead >
              <TableRow>
                <TableHeader>
                  Unique Code
                </TableHeader>
                <TableHeader>
                  Giga Layer Label
                </TableHeader>
                <TableHeader>
                  Source API
                </TableHeader>
                <TableHeader>
                  Parameter
                </TableHeader>
                <TableHeader>
                  Source Ver
                </TableHeader>
                <TableHeader>
                  Status
                </TableHeader>
                <TableHeader>
                  Active Countries
                </TableHeader>
                <TableHeader>
                  Publisher
                </TableHeader>
              </TableRow>
            </TableDataHead>
            <TableDataBody>
              {
                dataLayerList?.map((item) => (
                  <TableRow key={item.id}>
                    <TableDataCell>
                      <Link to={viewGigaLayer} params={{ id: item.id }}>{item?.code}</Link>
                    </TableDataCell>
                    <TableDataCell>
                      <Link to={viewGigaLayer} params={{ id: item.id }}>{item?.name} {!item.created_by && `(default)`}</Link>
                    </TableDataCell>
                    <TableDataCell>
                      {item?.data_sources_list.map((sourceApiObj, index, array) => (
                        <span key={sourceApiObj.id}>{sourceApiObj.name}
                          {index !== array.length - 1 && ','}
                        </span>
                      ))}
                    </TableDataCell>
                    <TableDataCell>
                      <span>{Object.values(item?.data_source_column ?? {})[0]?.alias}</span>
                    </TableDataCell>
                    <TableDataCell>

                      <span>{item?.data_sources_list[0].version}</span>

                    </TableDataCell>
                    <TableDataCell>
                      {
                        <StatusWrapper color={DataSourceStatusChoices[item?.status.toUpperCase()]}>
                          {DataSourceStatusNames[item?.status]}
                        </StatusWrapper>
                      }
                    </TableDataCell>
                    <TableDataCell>
                      {item?.applicable_countries.length > 0 ? item?.applicable_countries.length : countryList?.length}
                      <CountryListToggletip
                        align="bottom">
                        <ToggletipButton>
                          <DataLayerActiveCountries>
                            View list
                          </DataLayerActiveCountries>
                        </ToggletipButton>
                        <CountryListToggletipContent>
                          <p className="list-content">
                            {getCountryName(item.applicable_countries)?.map((country) => country?.name).join(', ') || 'All countries'}
                          </p>
                        </CountryListToggletipContent>
                      </CountryListToggletip>
                    </TableDataCell>
                    <TableDataCell>
                      {item?.published_by?.user_name ?? "--"}
                    </TableDataCell>
                  </TableRow>
                ))
              }
            </TableDataBody>
          </Table >
        </TableWrapper>
      </AdminTableScroll>
      < Pagination
        page={page}
        pageSize={pageSize}
        count={count}
        setPage={setPageAndSize}
      />
    </>
  )
}

export default ListGigaLayer