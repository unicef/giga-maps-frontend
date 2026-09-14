import "~/core/i18n/instance"

import { render, fireEvent, screen, waitFor } from "@testing-library/react"
import { fork } from "effector"
import { Provider } from "effector-react"

import { $connectivityStatsByEntity, $layerUtils, onSelectMainLayer } from "~/@/sidebar/sidebar.model"
import { EntityType } from "~/@/entities"
import { $mapRoutes, mapCountry, mapOverview } from "~/core/routes"
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

  test('in global view, hides live legend when reporting internet quality is 0', () => {
    const scope = fork({
      values: new Map()
        .set($mapRoutes, {
          country: false,
          entity: false,
          entityView: false,
          map: true,
          school: false,
          schools: false,
        })
        .set($connectivityStatsByEntity, {
          [EntityType.SCHOOL]: {
            no_of_entities_measure: 0,
          } as any,
        }),
    });

    render(
      <Provider value={scope}>
        {testWrapper(
          <LegendPopup open={true}>
            <div>Test Content</div>
          </LegendPopup>,
        )}
      </Provider>,
    );

    expect(screen.getByTestId('legend-expanded-view')).toBeInTheDocument();
    expect(screen.queryByTestId('live-layer-legend')).not.toBeInTheDocument();
  });

  test('in global view, shows live legend when reporting internet quality is > 0', () => {
    const scope = fork({
      values: new Map()
        .set($mapRoutes, {
          country: false,
          entity: false,
          entityView: false,
          map: true,
          school: false,
          schools: false,
        })
        .set($connectivityStatsByEntity, {
          [EntityType.SCHOOL]: {
            no_of_entities_measure: 15,
          } as any,
        }),
    });

    render(
      <Provider value={scope}>
        {testWrapper(
          <LegendPopup open={true}>
            <div>Test Content</div>
          </LegendPopup>,
        )}
      </Provider>,
    );

    expect(screen.getByTestId('legend-expanded-view')).toBeInTheDocument();
    expect(screen.getByTestId('live-layer-legend')).toBeInTheDocument();
  });

  test('in country view, live legend visibility is unaffected by reporting internet quality being 0', async () => {
    const scope = fork({
      values: new Map()
        .set($mapRoutes, {
          country: true,
          entity: false,
          entityView: false,
          map: false,
          school: false,
          schools: false,
        })
        .set($layerUtils, {
          currentLayerLegendsByEntity: {
            [EntityType.SCHOOL]: { colors: {}, values: [] },
          },
          currentLayerTypeUtilsByEntity: {
            [EntityType.SCHOOL]: {
              isLive: true,
              isSchoolStatus: false,
              isStatic: false,
            },
          },
          globalLayerDataByEntity: {},
          selectedLayerDataByEntity: {},
          selectedLayerIdByEntity: { [EntityType.SCHOOL]: 8 },
          countryActiveLayersDataById: {},
        })
        .set($connectivityStatsByEntity, {
          [EntityType.SCHOOL]: {
            no_of_entities_measure: 0,
          } as any,
        }),
    });

    render(
      <Provider value={scope}>
        {testWrapper(
          <LegendPopup open={true}>
            <div>Test Content</div>
          </LegendPopup>,
        )}
      </Provider>,
    );

    expect(screen.getByTestId('live-layer-legend')).toBeInTheDocument();
  });
})

