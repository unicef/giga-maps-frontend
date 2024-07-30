import { describe, expect, test, } from '@jest/globals';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event'

import { changeIsSearchFocused, changeSearchText, onShowCountriesAdminList } from '../../common-components/top-search-bar/top-search-bar.model';
import SearchResult from '..';
import { getSearchResultsFx } from '../container/search-result.fx';
import SearchResultList from '../views/search-result.list.view';
import { SearchResultWrapper } from '../styles/search-result-style';
import { testWrapper } from '~/tests/jest-wrapper';

describe('SearchResultList', () => {
  beforeEach(() => {
    fetchMock.mockResponse((req: Request) => {
      if (req.url.includes('api/locations/search-countries/')) {
        return Promise.resolve(JSON.stringify([{
          admin1_count: 1,
          country_code: "AI",
          country_id: 12,
          country_name: "India",
          data: {
            "A": {
              "admin2_name": "East End",
              "admin2_id": 4929,
              "admin2_description": "district",
              "admin2_description_ui_label": "district",
              "admin2_code": "AIA001002",
              "school_count": 1,
              data: {
                "B": {
                  admin2Code: "A2"
                }
              }
            }
          }
        }]))
      } else if (req.url.includes('/locations/gsearch/')) {
        return Promise.resolve(JSON.stringify({
          results: [{
            "country_name": "Argentina",
            "giga_id_school": "33ad9ec6-a5e5-3930-982c-3e3297260a6a",
            "id": 1231556,
            "admin1_name": "Córdoba",
            "country_id": 143,
            "admin2_name": "Capital",
            "external_id": "",
            "name": "ESCUELA REPUBLICA DE LA INDIA",
            "country_code": "AR",
            "@search.score": 1.0,
            "@search.highlights": null
          }]
        }))
      }
    })
  })
  test('renders SearchResult and take a snapshop', () => {
    onShowCountriesAdminList(true);
    const { asFragment } = render(<SearchResult />);
    expect(asFragment()).toMatchSnapshot();
  });

  test('renders SearchResult', async () => {
    onShowCountriesAdminList(true);
    render(<SearchResult />);
    expect(screen.queryByText('Not the results you expected?')).toBeInTheDocument();
  });

  test('renders SearchResult click outside', async () => {
    onShowCountriesAdminList(true);
    render(<SearchResult />);
    await userEvent.click(document.body);
    expect(screen.queryByText('Select region or school')).not.toBeInTheDocument();
  });

  test('renders SearchResult and onShowCountriesAdminList is false', async () => {
    render(<SearchResult />);
    await onShowCountriesAdminList(false);
    expect(screen.queryByText('Select region or school')).not.toBeInTheDocument();
  });

  test('renders SearchResultList with loading state', async () => {
    changeIsSearchFocused(true);
    const spy = jest.spyOn(getSearchResultsFx.pending, 'getState');
    spy.mockReturnValue(true);
    await render(<SearchResultList />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    spy.mockRestore();
  });


  test('renders SearchResultList with India Country', async () => {
    changeSearchText('India')
    await getSearchResultsFx({ query: 'India' })
    await render(<SearchResultList />);
    expect(screen.getByText('ESCUELA REPUBLICA DE LA')).toBeInTheDocument();
  });

  it('should render component', () => {
    const { asFragment } = render(testWrapper(<SearchResultWrapper />));
    expect(asFragment).toMatchSnapshot();
  });
})