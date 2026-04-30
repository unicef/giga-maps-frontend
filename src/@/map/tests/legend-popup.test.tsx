import "~/core/i18n/instance"

import { render } from "@testing-library/react"

import { onSelectMainLayer } from "~/@/sidebar/sidebar.model"
import { fetchLayerListFx } from "~/api/project-connect"
import { fetchMockResponse } from "~/tests/fetchMock"
import { testWrapper } from "~/tests/test-wrapper"

import LegendPopup from "../ui/legend-info/legend-popup"

describe('LegendPopup', () => {
  beforeEach(() => {
    fetchMock.mockResponse(fetchMockResponse)

  })

  test('renders with school status legend in collapsed view by default', () => {
    const { container, getByTestId } = render(testWrapper(
      <LegendPopup open={true} setOpen={() => { }}>
        <div>Test Content</div>
      </LegendPopup>
    ))
    expect(container.querySelector('.legend-info-popover-content')).toBeInTheDocument()
    expect(getByTestId('legend-collapsed-view')).toBeInTheDocument()
    expect(container).toHaveTextContent('Average download speed')
    expect(getByTestId('legend-expand-button')).toBeInTheDocument()
  })

  test('renders with live layer legend', () => {
    void fetchLayerListFx();
    onSelectMainLayer(8);
    const { container, getByTestId } = render(testWrapper(
      <LegendPopup open={true} setOpen={() => { }}>
        <div>Test Content</div>
      </LegendPopup>
    ))
    expect(container.querySelector('.legend-info-popover-content')).toBeInTheDocument()
    getByTestId('legend-expand-button').click()
    expect(getByTestId('legend-expanded-view')).toBeInTheDocument()
  })

  test('renders with static layer legend', () => {
    void fetchLayerListFx();
    onSelectMainLayer(7);
    const { container, getByTestId } = render(testWrapper(
      <LegendPopup open={true} setOpen={() => { }}>
        <div>Test Content</div>
      </LegendPopup>
    ))
    expect(container.querySelector('.legend-info-popover-content')).toBeInTheDocument()
    getByTestId('legend-expand-button').click()
    expect(getByTestId('legend-expanded-view')).toBeInTheDocument()
  })

  test('switches between collapsed and expanded legend views', () => {
    const { getByTestId } = render(testWrapper(
      <LegendPopup open={true} setOpen={() => { }}>
        <div>Test Content</div>
      </LegendPopup>
    ))
    getByTestId('legend-expand-button').click()
    expect(getByTestId('legend-expanded-view')).toBeInTheDocument()
    getByTestId('legend-collapse-button').click()
    expect(getByTestId('legend-collapsed-view')).toBeInTheDocument()
  })

  test('resets to collapsed view after closing and reopening', () => {
    const { getByTestId, rerender } = render(testWrapper(
      <LegendPopup open={true} setOpen={() => { }}>
        <div>Test Content</div>
      </LegendPopup>
    ))

    getByTestId('legend-expand-button').click()
    expect(getByTestId('legend-expanded-view')).toBeInTheDocument()

    rerender(testWrapper(
      <LegendPopup open={false} setOpen={() => { }}>
        <div>Test Content</div>
      </LegendPopup>
    ))

    rerender(testWrapper(
      <LegendPopup open={true} setOpen={() => { }}>
        <div>Test Content</div>
      </LegendPopup>
    ))

    expect(getByTestId('legend-collapsed-view')).toBeInTheDocument()
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

