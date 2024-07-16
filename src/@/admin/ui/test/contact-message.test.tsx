import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { createEvent } from "effector";

import { contactMessageList } from "~/tests/data/contact-message-list";
import { testWrapper } from '~/tests/jest-wrapper';

import { $constactMessageList } from "../../models/contact-message.model";
import AdminContactMessage from "../contact-message/list-contact-message";
import ViewContactMessage from "../contact-message/view-contact-message";

const setConstactMessageList = createEvent()
$constactMessageList.on(setConstactMessageList, (_, payload) => payload)

describe('UserDetailsComponent', () => {
  test("render UserListComponent and take snapshot", () => {
    const { asFragment } = render(
      testWrapper(<AdminContactMessage />)
    );
    expect(asFragment()).toMatchSnapshot();
  })

  test("render UserListComponent with data", () => {
    setConstactMessageList(contactMessageList)
    testWrapper(<AdminContactMessage />)
  })

  test("render ViewContactMessage by click on view icon", () => {
    setConstactMessageList(contactMessageList)
    const handleClick = jest.fn();
    const { getByTestId } = render(testWrapper(<AdminContactMessage onClick={handleClick} />));
    const button = getByTestId(`contact-message-view-${contactMessageList.results[0]?.id}`);
    fireEvent.click(button);
    void waitFor(() => {
      render(testWrapper(<ViewContactMessage />))
      expect(screen.getByText('Full Name'))
      expect(screen.getByText(contactMessageList.results[0]?.full_name))
    })
  })
})