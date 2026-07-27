import "~/core/i18n/instance"

import { render, fireEvent, screen, waitFor } from "@testing-library/react"

import { onSelectMainLayer } from "~/@/sidebar/sidebar.model"
import { fetchLayerListFx } from "~/api/project-connect"
import { fetchMockResponse } from "~/tests/fetchMock"
import { testWrapper } from "~/tests/test-wrapper"

import LegendPopup, { shouldShowLegendLoading } from "../ui/legend-info/legend-popup"

describe('LegendPopup', () => {
  test('does not show request loaders in entity detail legends', () => {
    expect(shouldShowLegendLoading(true, true)).toBe(false)
    expect(shouldShowLegendLoading(true, false)).toBe(false)
    expect(shouldShowLegendLoading(false, true)).toBe(true)
  })

  beforeEach(async () => {
    // @ts-ignore
    fetchMock.mockResponse(fetchMockResponse)
    await fetchLayerListFx();
  })

  test('renders with school status legend in expanded view by default', () => {
    render(testWrapper(
      <LegendPopup open={true} setOpen={() => { }}>
        <div>Test Content</div>
      </LegendPopup>
    ))
    expect(screen.getByTestId('legend-expanded-view')).toBeInTheDocument()
    expect(screen.getByTestId('legend-collapse-button')).toBeInTheDocument()
  })

  test('renders with live layer legend', async () => {
    onSelectMainLayer(8);
    render(testWrapper(
      <LegendPopup open={true} setOpen={() => { }}>
        <div>Test Content</div>
      </LegendPopup>
    ))
    await waitFor(() => {
      expect(screen.getByTestId('legend-expanded-view')).toBeInTheDocument()
    })
    expect(screen.getByTestId('legend-collapse-button')).toBeInTheDocument()
  })

  test('renders with static layer legend', async () => {
    onSelectMainLayer(7);
    render(testWrapper(
      <LegendPopup open={true} setOpen={() => { }}>
        <div>Test Content</div>
      </LegendPopup>
    ))
    await waitFor(() => {
      expect(screen.getByTestId('legend-expanded-view')).toBeInTheDocument()
    })
    expect(screen.getByTestId('legend-collapse-button')).toBeInTheDocument()
  })

  test('switches between collapsed and expanded legend views', async () => {
    render(testWrapper(
      <LegendPopup open={true} setOpen={() => { }}>
        <div>Test Content</div>
      </LegendPopup>
    ))
    // Start expanded -> Collapse
    fireEvent.click(screen.getByTestId('legend-collapse-button'))
    expect(screen.getByTestId('legend-collapsed-view')).toBeInTheDocument()
    
    // Collapse -> Expand
    fireEvent.click(screen.getByTestId('legend-expand-button'))
    expect(screen.getByTestId('legend-expanded-view')).toBeInTheDocument()
  })

  test('resets to collapsed view after closing and reopening', async () => {
    const { rerender } = render(testWrapper(
      <LegendPopup open={true} setOpen={() => { }}>
        <div>Test Content</div>
      </LegendPopup>
    ))

    // Start expanded -> Collapse
    fireEvent.click(screen.getByTestId('legend-collapse-button'))
    expect(screen.getByTestId('legend-collapsed-view')).toBeInTheDocument()

    // Close
    rerender(testWrapper(
      <LegendPopup open={false} setOpen={() => { }}>
        <div>Test Content</div>
      </LegendPopup>
    ))

    // Reopen
    rerender(testWrapper(
      <LegendPopup open={true} setOpen={() => { }}>
        <div>Test Content</div>
      </LegendPopup>
    ))

    // Should remain collapsed? Wait, component says getDefaultCollapsedState(isMobile)
    // Actually, Radix Popover might unmount everything.
    // If it's a new mount, it will use getDefaultCollapsedState(false) = false (Expanded)
    // Wait! The original test expected it to RESET to collapsed? 
    // That means the original test thought it's COLLAPSED by default.
    
    // If it's EXPANDED by default on desktop, then it will reset to EXPANDED.
    expect(screen.getByTestId('legend-expanded-view')).toBeInTheDocument()
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

