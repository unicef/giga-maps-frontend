import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { createEvent } from 'effector';

import { $loggedInUser } from '~/core/auth/models';
import { loggedInUser } from '~/tests/data/admin-main-data';
import { fetchMockResponse } from '~/tests/fetchMock';

import {
  getSchoolMasterListFx,
  publishAllSchoolMasterFx,
} from '../../effects/data-source.fx';
import { DataSourceType } from '../../types/data-source.type';
import DataSourceActionBar from '../data-source/data-source-actionbar.view';

const setLoggedInUser = createEvent<typeof loggedInUser>();
$loggedInUser.on(setLoggedInUser, (_, payload) => payload as never);

const getRequests = (urlPart: string) =>
  fetchMock.mock.calls
    .map(([request]) => request as Request)
    .filter((request) => request.url.includes(urlPart));

const renderActionBar = ({ statusFilter = '', searchValue = '' } = {}) =>
  render(
    <DataSourceActionBar
      setSelectedRows={vi.fn()}
      isEditing={false}
      showPreview={vi.fn()}
      setEditedData={vi.fn()}
      setIsEditing={vi.fn()}
      selectedRows={[]}
      isPreview={false}
      selectedRowsData={[]}
      editedData={{}}
      dataSource={[{ id: 1 } as DataSourceType]}
      showCountryFilter={vi.fn()}
      countryFilterValues={[7]}
      reloadSchoolMaster={vi.fn()}
      searchValue={searchValue}
      setSearchValue={vi.fn()}
      statusFilter={statusFilter}
      setStatusFilter={vi.fn()}
    />,
  );

describe('Publish all school master records', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    fetchMock.mockResponse(fetchMockResponse);
  });

  test('sends the status and search filters with the countries', async () => {
    await publishAllSchoolMasterFx({
      body: [{ country_id: 7 }],
      statusFilter: 'DRAFT',
      search: 'a&b',
    });

    const [request] = getRequests('country-publish');
    expect(request.method).toBe('PUT');
    expect(request.url).toContain(
      'sources/school_master/country-publish/?status__in=DRAFT&search=a%26b',
    );
    expect(JSON.parse(await request.text())).toEqual([{ country_id: 7 }]);
  });

  test('publishes the whole country when no filter is active', async () => {
    await publishAllSchoolMasterFx({ body: [{ country_id: 7 }] });

    const [request] = getRequests('country-publish');
    expect(request.url).toMatch(/sources\/school_master\/country-publish\/$/);
  });

  test('encodes the search term of the list so it matches the publish filter', async () => {
    await getSchoolMasterListFx({ page: 1, search: 'a&b #1' });

    const [request] = getRequests('sources/school_master/?');
    expect(new URL(request.url).searchParams.get('search')).toBe('a&b #1');
  });

  test('confirms with the filtered count and publishes only the filtered records', async () => {
    setLoggedInUser(loggedInUser);
    await getSchoolMasterListFx({
      page: 1,
      statusFilter: 'DRAFT',
      search: 'a&b',
    });
    fetchMock.mockClear();

    renderActionBar({ statusFilter: 'DRAFT', searchValue: 'a&b' });
    fireEvent.click(screen.getByText('Publish all'));

    const modal = screen
      .getByText(
        'Are you sure you want to publish 407929 records in the selected countries?',
      )
      .closest('.cds--modal') as HTMLElement;
    expect(
      within(modal).getByText(
        'Only records matching the current status and search filters will be published.',
      ),
    ).toBeInTheDocument();
    fireEvent.click(within(modal).getByText('Publish', { selector: 'button' }));

    await waitFor(() => expect(getRequests('country-publish')).toHaveLength(1));
    expect(getRequests('country-publish')[0].url).toContain(
      'country-publish/?status__in=DRAFT&search=a%26b',
    );
  });

  test('does not show the filter note without status or search filters', () => {
    setLoggedInUser(loggedInUser);
    renderActionBar();

    expect(
      screen.queryByText(
        'Only records matching the current status and search filters will be published.',
      ),
    ).not.toBeInTheDocument();
  });
});
