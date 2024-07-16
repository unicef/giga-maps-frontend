import { describe, test, } from '@jest/globals';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createEvent } from 'effector';

import { onChangeMenu } from '~/@/sidebar/sidebar.model';
import { $loggedInUser } from '~/core/auth/models';
import { loggedInUser } from '~/tests/data/admin-main-data';
import { apiList, filterApiList } from '~/tests/data/explore-apis-list';
import { testWrapper } from '~/tests/jest-wrapper';

import { $exploreApiData, onChangeExploreApiList, setExploreApiCategory, setSearchExploreApi } from '../../models/explore-api.model';
import ApiInfo from '../components/api-info/api-info.view';
import ExploreApiRightSection from '../components/explore-api-right-section';
import ExploreApiList from '../components/explore-api-right-section/explore-api-list.view';
import ApiDocsMain from '../page/api-docs-main.view';


const setLoggedInUser = createEvent();
$loggedInUser.on(setLoggedInUser, (_, payload) => payload);

const setApiList = createEvent()
$exploreApiData.on(setLoggedInUser, (_, payload) => payload)

describe('ApiDocs', () => {
  test('renders ApiDocsMain and take a snapshop', () => {
    onChangeMenu(true)
    setLoggedInUser(loggedInUser)
    const { asFragment } = render(
      testWrapper(<ApiDocsMain />)
    );
    expect(asFragment()).toMatchSnapshot();
  });

  test('Render ExploreApiRightSection by click on side panel', () => {
    onChangeMenu(false)
    const handleClick = jest.fn()
    const { container } = render(testWrapper(<ApiDocsMain onClick={handleClick} />))
    const exploreApiButton = container.querySelector('#explore-api')
    fireEvent.click(exploreApiButton)
    setApiList(apiList)
    render(<ExploreApiRightSection />)
  })

  test('Render ExploreApiRightSection by click on side panel', () => {
    onChangeMenu(false)
    const handleClick = jest.fn()
    const { container } = render(testWrapper(<ApiDocsMain onClick={handleClick} />))
    const apiKeyButton = container.querySelector('#api-keys')
    fireEvent.click(apiKeyButton)
  })

  // test('Render ExploreApiRightSection by click on side panel', () => {
  //   setApiList(apiList)
  //   const handleClick = jest.fn()
  //   const { container } = render(testWrapper(<ApiDocsMain onClick={handleClick} />))
  //   const exploreApiButton = container.querySelector('#explore-api')
  //   fireEvent.click(exploreApiButton)
  //   onChangeExploreApiList(apiList.results)
  //   setApiList(apiList);
  //   void waitFor(() => {
  //     render(<ApiDocsMain />)
  //     render(<ExploreApiList />)
  //   })
  //   expect(screen.getByAltText(apiList.results[0].name))
  //   const documentationButton = container.querySelector(`#documentation-${apiList?.results[0]?.id}`)
  //   fireEvent.click(documentationButton)
  //   const input = container.querySelector('#text-input-explore-api')
  //   fireEvent.change(input, { target: { value: 'test-id' } })
  //   const submitButton = screen.getByText('Submit')
  //   fireEvent.click(submitButton)
  // })

  test("Render ApiInfo", () => {
    render(<ApiInfo />)
  })

})