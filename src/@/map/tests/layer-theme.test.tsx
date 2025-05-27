import { fireEvent, render } from "@testing-library/react"

import { testWrapper } from "~/tests/jest-wrapper"

import ThemeButtons from "../ui/layer-theme/theme-buttons"
import "~/core/i18n/instance"

describe('ThemeButtons', () => {
  test('ThemeButtons', () => {
    const handleClick = jest.fn()
    const { getByLabelText } = render(testWrapper(<ThemeButtons onClick={handleClick} />))
    const button = getByLabelText('Theme & Layers')
    fireEvent.click(button)
  })
})