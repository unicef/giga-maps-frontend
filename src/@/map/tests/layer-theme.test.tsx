import { fireEvent, render } from "@testing-library/react"

import { testWrapper } from "~/tests/test-wrapper"

import ThemeButtons from "../ui/layer-theme/theme-buttons"
import "~/core/i18n/instance"

describe('ThemeButtons', () => {
  test('ThemeButtons', () => {
    const handleClick = vi.fn()
    const { getByLabelText } = render(testWrapper(<ThemeButtons onClick={handleClick} />))
    const button = getByLabelText('Theme & Layers')
    fireEvent.click(button)
  })
})

