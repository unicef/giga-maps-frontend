import {
  Button,
  DataTable,
  IconButton,
  OverflowMenu,
  OverflowMenuItem,
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
  DataTableContainer, TableDataBody, TableDataHead, TableWrapper, ToolbarContent,
} from '../styles/admin-styles'
import { Add, Edit } from '@carbon/icons-react';
import { useEffect, useMemo, useState } from 'react';
import { useStore } from 'effector-react';
import { $filterListCount, $filterListResponse, $filterStatusChoices, $filterTypeChoices } from '../../models/filter-list.model';
import { deleteFilterFx, editFilterFx, getFilterListFx, publishFilterFx } from '../../effects/filter-fx';
import { addAdminFilter, adminFilterListRoute, editAdminFilter } from '~/core/routes';
import { ActionableNotification } from '@carbon/react';
import { Link } from '~/lib/router';
import { Div } from '~/@/common/style/styled-component-style';
import { FilterScroll } from './filter-list.styles';
import Pagination from '../common-components/Pagination';
import { $countryList } from '~/@/api-docs/models/explore-api.model';
import { FilterListType, FilterStatusType } from '../../types/filter-list.type';
import { StatusWrapper } from '~/@/api-docs/ui/components/api-keys-right-section/api-keys-right.side.style';
import { FilterStatusColors, getFilterStatus, getFilterType } from '../../utils/filter-list.util';
import PromptActionable, { PromptActionableType } from '../common-components/prompt-actionable';
import SearchToolbar from '../common-components/search-toolbar';

const headers = [
  { key: 'code', header: 'Code' },
  { key: 'name', header: 'Filter name' },
  { key: 'parameter', header: 'Parameter' },
  { key: 'type', header: 'Filter type' },
  { key: 'options', header: 'Filter options' },
  { key: 'countries', header: 'Countries' },
  { key: 'status', header: 'Status' },
  { key: 'publisher', header: 'Publisher' },
  { key: 'action', header: 'Action' },
]

const ListFilterView = () => {
  const [promptData, setPromptData] = useState<null | PromptActionableType>(null);
  const [search, setSearchValue] = useState('');
  const filterList = useStore($filterListResponse) || { results: [] };
  const { typeChoices } = useStore($filterTypeChoices)
  const count = useStore($filterListCount);
  const { statusChoices } = useStore($filterStatusChoices)
  const [{ page, pageSize }, setPageAndSize] = useState({ page: 1, pageSize: 20 });
  const countryList = useStore($countryList);
  const onViewPage = useStore(adminFilterListRoute.visible);
  const reloadApiCall = async () => {
    void getFilterListFx({ page, pageSize, search });
  }
  const deleteFilterData = async (id: number) => {
    try {
      await deleteFilterFx({ id });
      reloadApiCall();
    } catch (e) { console.error(e) }
  }

  const updateFilter = async (id: number, body: { status: FilterStatusType }) => {
    try {
      await editFilterFx({ id, body });
      reloadApiCall();
    } catch (e) { console.error(e) }
  }


  const publishFilter = async (id: number) => {
    try {
      await publishFilterFx({ id })
      reloadApiCall();
    } catch (e) { console.error(e) }
  }

  const showOptions = (item: FilterListType) => {
    const { isDropdown } = getFilterType(item.type);
    if (isDropdown) {
      return item.options?.live_choices ? 'Live choices' : 'Static choices'
    }
    return '-'
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

  const rows = useMemo(() => filterList?.map((item) => {
    const { inDraft, isActivated, isDisabled } = getFilterStatus(item.status);
    return ({
      ...item,
      type: typeChoices[item.type],
      options: showOptions(item),
      parameter: item?.column_configuration?.label,
      countries: getCountryName(item?.active_countries_list),
      publisher: item?.published_by?.first_name,
      status: <>
        <StatusWrapper color={FilterStatusColors[item?.status.toUpperCase()]}>
          {statusChoices[item?.status]}
        </StatusWrapper>
      </>,
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

        <OverflowMenu flipped aria-label="overflow-menu" size="md">
          {(inDraft || isDisabled) && <OverflowMenuItem itemText="Activate" onClick={() => {
            setPromptData({
              kind: "warning",
              title: "Are you sure you want to activate this filter?",
              onActionButtonClick: () => publishFilter(item.id ?? 0)
            })
          }} />}
          {isActivated && <OverflowMenuItem itemText="Deactivate" onClick={() => {
            setPromptData({
              kind: "warning",
              title: "Are you sure you want to deactivate this filter?",
              onActionButtonClick: () => updateFilter(item.id ?? 0, { status: FilterStatusType.DISABLED })
            })
          }} />}
          {(inDraft || isDisabled) && <OverflowMenuItem hasDivider isDelete itemText="Delete" onClick={() => {
            setPromptData({
              kind: "error",
              title: "Are you sure you want to delete this filter?",
              onActionButtonClick: () => deleteFilterData(item.id ?? 0)
            })
          }} />}
        </OverflowMenu>
      </Div>
    })
  }), [filterList]);

  useEffect(() => {
    if (onViewPage) {
      reloadApiCall();
    }
  }, [onViewPage, page, pageSize, search]);

  return (
    <>
      <PageTitleComponent
        title={"Filters"}
        subTitle={"List of filters"}
        recentlyView={false} />
      {!!promptData &&
        <PromptActionable
          {...promptData}
          onActionDone={() => setPromptData(null)}
          onClose={() => setPromptData(null)}
        />
      }
      <DataTable rows={rows} headers={headers} >
        {({
          rows,
          headers,
          getTableProps,
          getRowProps,
          getToolbarProps
        }) => {
          return <DataTableContainer>
            <TableToolbar {...getToolbarProps()}>
              <ToolbarContent>
                <SearchToolbar placeholder="Filter by name, type" onSearchChange={setSearchValue} />
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