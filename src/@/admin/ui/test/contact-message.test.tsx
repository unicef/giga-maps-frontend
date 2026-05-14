import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { createEvent, createStore } from "effector";

import { contactMessageList } from "~/tests/data/contact-message-list";
import { testWrapper } from '~/tests/test-wrapper';

import { $constactMessageList, $formContactMessage } from "../../models/contact-message.model";
import AdminContactMessage from "../contact-message/list-contact-message";
import ViewContactMessage from "../contact-message/view-contact-message";

vi.mock('~/core/routes', async (importOriginal) => {
  const actual = await importOriginal<typeof import('~/core/routes')>();
  return {
    ...actual,
    contactMessageView: {
      ...actual.contactMessageView,
      params: createStore({ id: 2 }),
    },
  };
});

const setConstactMessageList = createEvent()
$constactMessageList.on(setConstactMessageList, (_, payload) => payload)

const setFormContactMessage = createEvent()
$formContactMessage.on(setFormContactMessage, (_, payload) => payload)

describe('ContactMessageComponent', () => {
  test("render AdminContactMessage and take snapshot", () => {
    const { asFragment } = render(
      testWrapper(<AdminContactMessage />)
    );
    expect(asFragment()).toMatchSnapshot();
  })

  test("render AdminContactMessage with data", () => {
    setConstactMessageList(contactMessageList)
    testWrapper(<AdminContactMessage />)
  })

  test("render ViewContactMessage with data", async () => {
    const { results } = contactMessageList;
    setFormContactMessage(results[0]);
    render(testWrapper(<ViewContactMessage />))
    await waitFor(() => {
      expect(screen.getByText(/Full Name/i)).toBeInTheDocument();
      expect(screen.getAllByText(results[0]?.full_name as string).length).toBeGreaterThan(0);
    })
  })
})

