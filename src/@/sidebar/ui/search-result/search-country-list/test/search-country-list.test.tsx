import { describe, expect, jest, test } from '@jest/globals';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import { createEvent } from 'effector';

import { APIListType } from '~/api/types';
import { setPayload } from '~/lib/effector-kit';

import { $isSearchFocused, changeIsSearchFocused } from '../../../common-components/top-search-bar/top-search-bar.model';
import { MAX_SCHOOL_SELECTED } from '../../container/search-result.constant';
import { fetchSchoolListFx } from '../../container/search-result.fx';
import { $searchCountryList, $searchHistoryData, $searchSchoolIds, $searchSchoolList, onSearchItemClick, setSchoolSelection, setSearchCountryExpand, setSearchExpandLevel1, setSearchExpandLevel2 } from '../../container/search-result.model';
import { CountryWithDistrictCount, SearchResultApi } from '../../container/search-result.type';
import { SearchCountryList } from "..";
import { SearchButtonGroup } from '../search-button-group';
import { expandDistrict2, SearchDistrict } from '../search-district-view';
import SearchHistory from '../search-history.view';
import { SearchSchool, setShowMessage } from '../search-school-item-view';
import SearchSchoolListPanel from '../search-school-list-view';
import SearchSchoolPanel from '../search-school-panel-view';
import "~/core/i18n/instance"

const updateContryList = createEvent<CountryWithDistrictCount[]>();
$isSearchFocused.on(changeIsSearchFocused, setPayload);
$searchCountryList.on(updateContryList, setPayload);

const updateSearchSchoolList = createEvent<APIListType<SearchResultApi> | null>();
//$searchSchoolList.on(updateSearchSchoolList, setPayload);
$searchSchoolList.on(updateSearchSchoolList, setPayload);

const updateSelectedSchool = createEvent<any>()
$searchSchoolIds.on(updateSelectedSchool, setPayload)

const updateSearchHistory = createEvent<any>()
$searchHistoryData.on(updateSearchHistory, setPayload)


describe('SearchCountryList', () => {
  test('renders SearchCountryList and take a snapshop', () => {
    changeIsSearchFocused(true);
    const { asFragment } = render(<SearchCountryList />);
    expect(asFragment()).toMatchSnapshot();
  });

  test('renders SearchCountryList', () => {
    changeIsSearchFocused(true);
    updateContryList([{
      "country_id": 45,
      "country_name": "India",
      "country_code": "IN",
      "data": {
        "Unknown": {
          "admin1_name": "Unknown",
          "data": {},
          "school_count": 49234,
          "admin2_count": 0
        }
      },
      "admin1_count": 1
    }])
    void waitFor(() => {
      render(<SearchCountryList />);
    });
    expect(screen.getByText('India')).toBeVisible();
  });

  test('renders SearchSchoolListPanel with loading state', () => {
    const spy = jest.spyOn(fetchSchoolListFx.pending, 'getState');
    spy.mockReturnValue(true);
    void waitFor(() => {
      render(<SearchSchoolListPanel />);
    });
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    spy.mockRestore();
  });

  test('renders SearchSchoolListPanel with empty data', () => {
    changeIsSearchFocused(true);
    updateSearchSchoolList({
      count: 0,
      results: []
    } as unknown as APIListType<SearchResultApi>)

    void waitFor(() => {
      render(<SearchSchoolListPanel />);
    });
    expect(screen.getByText('Not found')).toBeInTheDocument();
  });

  test('render SearchSchoolListPanel and close using close button', async () => {
    changeIsSearchFocused(true);
    render(<SearchSchoolListPanel />);
    const closeIcon = await screen.findByTestId('close-school-list-icon');
    await userEvent.click(closeIcon);
    void waitFor(() => { expect(screen.queryByText('School List')).not.toBeInTheDocument(); })
  })

  test('renders SearchSchoolListPanel with mock data', () => {
    changeIsSearchFocused(true);
    updateSearchSchoolList({
      count: 2,
      results: [{
        "country_code": "AF",
        "admin1_name": "Unknown",
        "name": "Abdak High School",
        "country_name": "Afghanistan",
        "country_id": 24,
        "id": 4550763,
        "admin2_name": null,
        "@search.score": 1,
        "@search.highlights": null
      },
      {
        "country_code": "AF",
        "admin1_name": "Unknown",
        "name": "Abdul Baqi Shaheed Girls Middle School / Boys High School",
        "country_name": "Afghanistan",
        "country_id": 24,
        "id": 4550869,
        "admin2_name": null,
        "@search.score": 1,
        "@search.highlights": null
      }]
    } as unknown as APIListType<SearchResultApi>)

    void waitFor(() => {
      render(<SearchSchoolListPanel />);
    });
    expect(screen.getByText('abdak high school')).toBeInTheDocument();
    expect(screen.getByText('abdul baqi shaheed girls middle school / boys high school')).toBeInTheDocument();
  });

  test('render SearchSchoolPanel with isExpanded=true', () => {
    changeIsSearchFocused(true)
    setSearchExpandLevel2(" ")
    render(<SearchSchoolPanel />)
    void waitFor(() => {
      expect(screen.queryByText('School List')).toBeInTheDocument();
      expect(screen.queryByText('Search schools')).toBeInTheDocument();

    })
  })

  test('renders school item with name and id', () => {
    const school = {
      "country_code": "AF",
      "admin1_name": "Unknown",
      "name": "Abdak High School",
      "country_name": "Afghanistan",
      "country_id": 24,
      "id": 4550763,
      "admin2_name": "Unknown",
      "external_id": "4550763",
    };
    void waitFor(() => {
      render(<SearchSchool school={school} />);
    })
    expect(screen.queryByText('abdak high school')).toBeInTheDocument();
    expect(screen.queryByText('4550763')).toBeInTheDocument();
  });

  // test('clicking school item toggles selection', () => {
  //   const school =
  //   {
  //     "country_code": "AF",
  //     "admin1_name": "Unknown",
  //     "name": "Abdak High School",
  //     "country_name": "Afghanistan",
  //     "country_id": 24,
  //     "id": 4550763,
  //     "admin2_name": "Unknown",
  //   }
  //   void waitFor(() => {
  //     render(<SearchSchool school={school} />);
  //   })
  //   const checkbox = screen.getByLabelText('');
  //   act(() => {
  //     fireEvent.click(checkbox)
  //   });
  //   setSchoolSelection([school, true])
  //   act(() => {
  //     fireEvent.click(checkbox)
  //   });
  //   setSchoolSelection([school, false])
  // });

  test('display warning toast when maximum schools are selected', () => {
    const school = {
      "country_code": "AF",
      "admin1_name": "Unknown",
      "name": "Abdak High School",
      "country_name": "Afghanistan",
      "country_id": 24,
      "external_id": "121122",
      "id": 4550763,
      "admin2_name": "Unknown",
    };
    void waitFor(() => {
      render(<SearchSchool school={school} />);
    })
    updateSelectedSchool(new Set([
      "4550879",
      "4550560",
      "4550817",
      "4550791",
      "4550646",
      "4550869",
      "4550763",
      "4550496",
      "4550490",
      "4550925",
      "4550492",
      "4550447",
      "4550470",
      "4550758",
      "4550443",
      "4550897",
      "4550448",
      "4550884",
      "4550482",
      "4550480"
    ]))
    setShowMessage(school.id)
    void waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.queryByText(`Maximum of ${MAX_SCHOOL_SELECTED} school selection allowed`)).toBeInTheDocument();
    })
  });

  test('render SearchHistory', () => {
    changeIsSearchFocused(true);
    const country = {
      "countryId": 45,
      "name": "India",
      "countryName": "India",
      "countryCode": "IN",
      "id": 17016735120827332,
      "type": "COUNTRY"
    }
    updateSearchHistory([country])
    void waitFor(() => {
      render(<SearchHistory />);
    })
    expect(screen.queryByText('Recent')).toBeInTheDocument();
    expect(screen.queryByText('India')).toBeInTheDocument();
  })

  test('calls onSearchItemClick when a history item is clicked', () => {
    changeIsSearchFocused(true);
    const country = {
      "countryId": 45,
      "name": "India",
      "countryName": "India",
      "countryCode": "IN",
      "id": 17016735120827332,
      "type": "COUNTRY"
    }
    updateSearchHistory([country])
    void waitFor(() => {
      render(<SearchHistory />);
    })
    const searchItem = screen.getByText('India');
    act(() => {
      fireEvent.click(searchItem);
    })
    void waitFor(() => {
      expect(onSearchItemClick).toHaveBeenCalledWith(country);
    })
  })

  // test('render SearchCountry and expand Districts', () => {
  //   const countryData: CountryWithDistrictCount = {
  //     country_id: 24,
  //     country_name: "Afghanistan",
  //     country_code: "AF",
  //     data: {
  //       Unknown: {
  //         admin1_name: "Unknown",
  //         admin1_code: "",
  //         data: {},
  //         school_count: 1733,
  //         admin1_description_ui_label: "Unknown",
  //         admin2_count: 0
  //       }
  //     },
  //     admin1_count: 1
  //   }

  //   render(<SearchCountry countryData={countryData} />)

  //   const expandButton = screen.getByRole('button', { name: /1 District/i })

  //   fireEvent.click(expandButton)

  //   void waitFor(() => {
  //     expect(setSearchCountryExpand).toHaveBeenCalledWith(24, false)
  //   })
  // })


  // test('render search district list and expand Admin', () => {
  //   const districtData = {
  //     "admin1_name": "Buenos Aires",
  //     "admin1_code": "",
  //     "admin1_description_ui_label": "",
  //     "data": {
  //       "25 DE MAYO": {
  //         "type": "Admin",
  //         "admin2_name": "25 DE MAYO",
  //         "data": {},
  //         "school_count": 1
  //       }
  //     },
  //     "admin2_count": 1
  //   }
  //   const countryId = "147";
  //   const code = 'AR'

  //   const { getByText } = render(<SearchDistrict districtData={districtData} countryId={countryId} code={code} />)
  //   act(() => {
  //     fireEvent.click(getByText(`${districtData.admin2_count} Admins`));
  //   });
  //   void waitFor(() => {
  //     expect(expandDistrict).toHaveBeenCalledWith(districtData.admin1_name, false);
  //   })

  // })


  test('render search district list and expand school list', () => {
    const districtData = {
      "admin1_name": "Unknown",
      "data": {},
      "school_count": 1,
      "admin2_count": 0
    }
    const countryId = "24";
    const code = 'AF'
    const { getByText } = render(<SearchDistrict districtData={districtData} countryId={countryId} code={code} />)
    fireEvent.click(getByText(`${districtData.school_count} Schools`));
    void waitFor(() => {
      expect(expandDistrict2).toHaveBeenCalledWith(districtData.admin1_name, false);
    })
  })

  test('render SearchButtonGroup', () => {
    changeIsSearchFocused(true)
    setSearchExpandLevel2("")
    void waitFor(() => {
      render(<SearchButtonGroup />)
    })
    expect(screen.queryByText('School(s) Selected')).not.toBeInTheDocument();
  })

  test("onclick of close button", () => {
    setSearchExpandLevel2(" ")
    const { getByTestId } = render(<SearchButtonGroup />)
    const closeButton = getByTestId('selected-school-close-button');
    fireEvent.click(closeButton);
    void waitFor(() => {
      expect(screen.queryByText('School(s) Selected')).not.toBeInTheDocument();
    })
  })

  test('school list count is undefined', () => {
    setSearchExpandLevel2(" ")
    updateSearchSchoolList({
      count: 0,
      results: []
    } as unknown as APIListType<SearchResultApi>)
    void waitFor(() => {
      render(<SearchButtonGroup />)
    })
    expect(screen.queryByText('0–0 of 0 items')).toBeInTheDocument();
  })

  test("onclick of apply button", () => {
    setSearchExpandLevel2(" ")
    const { getByTestId } = render(<SearchButtonGroup />)
    const applyButton = getByTestId('selected-school-apply-button');
    fireEvent.click(applyButton);
    void waitFor(() => {
      expect(screen.queryByText('School(s) Selected')).not.toBeInTheDocument();
    })
  })
})