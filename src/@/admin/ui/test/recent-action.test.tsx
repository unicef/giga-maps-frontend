import { render } from "@testing-library/react"
import { createEvent } from "effector"

import { mockRecentActions } from "../../../../tests/data/recent-action-list";
import { $recentActionList } from "../../models/recent-action.model";
import AdminRecentActions from "../recent-action/list-recent-actions"

const setRecentActionList = createEvent();
$recentActionList.on(setRecentActionList, (_, payload) => payload)

describe("AdminRecentActions", () => {
  setRecentActionList(mockRecentActions)
  test("Render AdminRecentActions", () => {
    render(<AdminRecentActions />)
  })
})