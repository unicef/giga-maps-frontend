import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createEvent } from "effector"

import { backgroundTaskList } from "~/tests/data/background-task-list";
import { testWrapper } from "~/tests/jest-wrapper";

import { $backgroundTaskList } from "../../models/background-task-model";
import BackgroundTaskForm from "../background-task-crud/form-background-task";
import AdminBackgroundTask from "../background-task-crud/list-background-task";
import BackgroundTaskView from "../background-task-crud/view-background-task";

const setBackgroundTaskList = createEvent();
$backgroundTaskList.on(setBackgroundTaskList, (_, Payload) => Payload)

describe("Background Task Crud", () => {
  test("render AdminBackgroundTask", () => {
    setBackgroundTaskList(backgroundTaskList);
    const { asFragment } = render(testWrapper(<AdminBackgroundTask />))
    expect(asFragment()).toMatchSnapshot()
    expect(screen.getByText('List of Background Task')).toBeInTheDocument()
  })

  test("render form background task", () => {
    const handleClick = jest.fn();
    const { getByTestId } = render(testWrapper(<AdminBackgroundTask onClick={handleClick} />));
    const button = getByTestId(`background-task-view${backgroundTaskList?.results[0]?.task_id}`);
    fireEvent.click(button);
    void waitFor(() => {
      render(testWrapper(<BackgroundTaskView />))
    })
    expect(screen.getByText('Task id')).toBeInTheDocument()
    expect(screen.getByText(backgroundTaskList?.results[0]?.task_id)).toBeInTheDocument()
  })
})

