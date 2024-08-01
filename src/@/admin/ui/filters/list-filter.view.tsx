import {
  Button,
  DataTable,
  IconButton,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  TableToolbar,
  ToggletipButton,
} from '@carbon/react';
import PageTitleComponent from '../common-components/page-title-component';
import {
  CountryListToggletip,
  CountryListToggletipContent,
  DataLayerActiveCountries,
  DataTableContainer, DeleteConfirmation, TableDataBody, TableDataHead, TableWrapper, ToolbarContent,
} from '../styles/admin-styles'
import { Add, Edit, Delete } from '@carbon/icons-react';
import { useEffect, useMemo, useState } from 'react';
import { useStore } from 'effector-react';
import { $filterListCount, $filterListResponse } from '../../models/filter-list.model';
import { deleteFilterApiKeyRequestFx, getFilterListFx } from '../../effects/filter-fx';
import { addAdminFilter, editAdminFilter } from '~/core/routes';
import { ActionableNotification } from '@carbon/react';
import { Link } from '~/lib/router';
import { Div } from '~/@/common/style/styled-component-style';
import { FilterScroll } from './filter-list.styles';
import Pagination from '../common-components/Pagination';
import { $countryList } from '~/@/api-docs/models/explore-api.model';

const headers = [
  { key: 'name', header: 'Filter name' },
  { key: 'parameter', header: 'Parameter' },
  { key: 'type', header: 'Filter type' },
  { key: 'options', header: 'Filter options' },
  { key: 'countries', header: 'Countries' },
  { key: 'publisher', header: 'Publisher' },
  { key: 'action', header: 'Action' },
]

const ListFilterView = () => {
  const [apiKeyDeleteId, setApiKeyDeleteId] = useState<null | number>(null);
  const filterList = useStore($filterListResponse) || { results: [] };
  const count = useStore($filterListCount);
  const [{ page, pageSize }, setPageAndSize] = useState({ page: 1, pageSize: 20 });
  const countryList = useStore($countryList);
  const deleteFilterData = async (id: number) => {
    setApiKeyDeleteId(null)
    try {
      await deleteFilterApiKeyRequestFx({ id })
    } catch (e) { console.error(e) }
  }

  const getCountryName = (activeCountriesIds: number[]) => {
    const activeCountries = countryList?.filter(item => activeCountriesIds.includes(item.id));
    let countries = activeCountries?.map(item => item.name).join(", ") ?? 'All countries';
    return <>
      {activeCountriesIds?.length > 0 ? activeCountriesIds.length : countryList?.length}
      <CountryListToggletip
        align="bottom">
        <ToggletipButton>
          <DataLayerActiveCountries>
            View list
          </DataLayerActiveCountries>
        </ToggletipButton>
        <CountryListToggletipContent>
          <p className="list-content">
            {countries}
          </p>
        </CountryListToggletipContent>
      </CountryListToggletip>
    </>
  }

  const rows = useMemo(() => filterList?.map((item) => ({
    ...item,
    options: "-",
    parameter: item?.column_configuration?.name,
    countries: getCountryName(item?.active_countries_list),
    publisher: item?.published_by?.name,
    action: <Div style={{ display: "flex", marginLeft: "-16px" }}>
      <Link to={editAdminFilter} params={{ id: item.id ?? 0 }}>
        <IconButton
          kind='ghost'
          size='md'
          label='Edit'
          tooltipText='Edit'
          renderIcon={Edit}
        />
      </Link>
      <IconButton
        kind='ghost'
        size='md'
        label='Delete'
        tooltipText='Delete'
        renderIcon={Delete}
        onClick={() => setApiKeyDeleteId(item.id ?? 0)}
      ></IconButton>
    </Div>
  })), [filterList]);

  useEffect(() => {
    void getFilterListFx();
  }, [])

  console.log("rows", rows);

  return (
    <>
      <PageTitleComponent
        title={"Filters"}
        subTitle={"Lorem Ipsum"}
        recentlyView={false} />
      {!!apiKeyDeleteId &&
        <DeleteConfirmation>
          <ActionableNotification
            style={{ maxWidth: "100%" }}
            lowContrast inline
            title="Delete filter data - "
            subtitle="Are you sure?"
            closeOnEscape
            actionButtonLabel="Yes"
            onActionButtonClick={() => void deleteFilterData(apiKeyDeleteId)}
            onClose={() => setApiKeyDeleteId(null)}
          />
        </DeleteConfirmation>
      }
      <DataTable rows={rows} headers={headers} >
        {({
          rows,
          headers,
          getTableProps,
          getRowProps,
          getBatchActionProps,
          getToolbarProps
        }) => {
          return <DataTableContainer>
            <TableToolbar {...getToolbarProps()}>
              <ToolbarContent>
                <Link to={addAdminFilter}>
                  <Button
                    renderIcon={Add}
                    onClick={() => { }}
                  >
                    Add new filter
                  </Button>
                </Link>
              </ToolbarContent>
            </TableToolbar>
            <FilterScroll>
              <TableWrapper $minHeight='13.1rem'>
                <Table {...getTableProps()} aria-label="sample table">
                  <TableDataHead>
                    <TableRow>
                      {headers.map((header, i) => <TableHeader key={i} >
                        {header.header}
                      </TableHeader>)}
                    </TableRow>
                  </TableDataHead>
                  <TableDataBody>
                    {rows.map((row) =>
                      <TableRow {...getRowProps({ row })} key={row.id}>
                        {row.cells.map((cell) =>
                          <TableCell key={cell.id}>{cell.value}</TableCell>
                        )}
                      </TableRow>
                    )}
                  </TableDataBody>
                </Table>
              </TableWrapper>
            </FilterScroll>
          </DataTableContainer>;
        }}
      </DataTable>
      <Pagination
        page={page}
        pageSize={pageSize}
        count={count}
        setPage={setPageAndSize}
      />
    </>
  )
}

export default ListFilterView;