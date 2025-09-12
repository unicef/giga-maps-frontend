import { render } from "@testing-library/react"
import { testWrapper } from "~/tests/jest-wrapper"
import LegendPopup from "../ui/legend-info/legend-popup"
import "~/core/i18n/instance"
import { fetchMockResponse } from "~/tests/fetchMock"
import { fetchLayerListFx } from "~/api/project-connect"
import { onSelectMainLayer } from "~/@/sidebar/sidebar.model"

describe('LegendPopup', () => {
  beforeEach(() => {
    fetchMock.mockResponse(fetchMockResponse)

  })

  test('renders with school status legend', () => {
    const { container } = render(testWrapper(
      <LegendPopup open={true} setOpen={() => { }}>
        <div>Test Content</div>
      </LegendPopup>
    ))
    expect(container.querySelector('.legend-info-popover-content')).toBeInTheDocument()
  })

  test('renders with live layer legend', async () => {
    await fetchLayerListFx();
    await onSelectMainLayer(8);
    const { container } = render(testWrapper(
      <LegendPopup open={true} setOpen={() => { }}>
        <div>Test Content</div>
      </LegendPopup>
    ))
    expect(container.querySelector('.legend-info-popover-content')).toBeInTheDocument()
  })

  test('renders with static layer legend', async () => {
    await fetchLayerListFx();
    await onSelectMainLayer(7);
    const { container } = render(testWrapper(
      <LegendPopup open={true} setOpen={() => { }}>
        <div>Test Content</div>
      </LegendPopup>
    ))
    expect(container.querySelector('.legend-info-popover-content')).toBeInTheDocument()
  })

  test('handles shouldShowControls when map level is true', () => {
    const { container } = render(testWrapper(
      <LegendPopup open={true} setOpen={() => { }}>
        <div>Test Content</div>
      </LegendPopup>
    ))
    expect(container.querySelector('.legend-info-popover-content')).toBeInTheDocument()
  })

  test('renders children content', () => {
    const { getByText } = render(testWrapper(
      <LegendPopup open={true} setOpen={() => { }}>
        <div>Child Content</div>
      </LegendPopup>
    ))
    expect(getByText('Child Content')).toBeInTheDocument()
  })
})
