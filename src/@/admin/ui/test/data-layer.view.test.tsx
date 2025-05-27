import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createEvent } from "effector";

import { $loggedInUser } from "~/core/auth/models";
import { currentLayerMockWithDraftStaus, currentLayerMockWithReadyToPublishStaus, dataLayerlistMock, singleLayerMock } from "~/tests/data/admin-data-layer";
import { loggedInUser } from "~/tests/data/admin-main-data";
import { testWrapper } from "~/tests/jest-wrapper";

import { getDataPreviewFx } from "../../effects/giga-layer-fx";
import { $currentGigaLayerItem, $dataLayerListResponce, $previewData, resetPreviewData } from "../../models/giga-layer.model";
import DataLayerMainView from "../giga-layer";
import AddEditGigaLayer from "../giga-layer/add-edit-giga-layer.view";
import ListGigaLayer from "../giga-layer/list-giga-layer.view";
import PreviewGigaLayer from "../giga-layer/preview-giga-layer";
import AdminViewLayer from "../giga-layer/view-giga-layer.view";
import { addGigaLayer, adminGigaLayer, editGigaLayer, viewGigaLayer } from "~/core/routes";
import { fetchMockResponse } from "~/tests/fetchMock";
import { getAppConfigValues } from "../../models/admin-model";
import { getCountryList } from "~/@/api-docs/models/explore-api.model";

const setDataLayerListResponce = createEvent();
$dataLayerListResponce.on(setDataLayerListResponce, (_, payload) => payload)

const setCurrentGigaLayerItem = createEvent()
$currentGigaLayerItem.on(setCurrentGigaLayerItem, (_, payload) => payload)

const setPreviewData = createEvent();
$previewData.on(setPreviewData, (_, payload) => payload)

const setLoggedInUser = createEvent();
$loggedInUser.on(setLoggedInUser, (_, payload) => payload);

describe('DataLayerMainView', () => {

  beforeEach(() => {
    getAppConfigValues()
    getCountryList(false);
    fetchMock.mockResponse(fetchMockResponse)
  })
  test('render DataLayerMainView and take snapshot', () => {
    const { asFragment } = render(
      testWrapper(<DataLayerMainView />)
    );
    expect(asFragment()).toMatchSnapshot();
  })

  test('render DataLayerMainView: adminGigaLayer,addGigaLayer,editGigaLayer,viewGigaLayer', () => {
    adminGigaLayer.navigate();
    const { rerender } = render(
      testWrapper(<DataLayerMainView />)
    );
    expect(window.location.pathname).toBe('/admin/giga-layer');
    // container.update();
    addGigaLayer.navigate();
    rerender(testWrapper(<DataLayerMainView />))
    expect(window.location.pathname).toBe('/admin/giga-layer/create');

    editGigaLayer.navigate({ id: 1 });
    rerender(testWrapper(<DataLayerMainView />))
    expect(window.location.pathname).toBe('/admin/giga-layer/edit/1');

    viewGigaLayer.navigate({ id: 1 });
    rerender(testWrapper(<DataLayerMainView />))
    expect(window.location.pathname).toBe('/admin/giga-layer/view/1');
  })

  test('render ListGigaLayer ', () => {
    const { asFragment } = render(
      testWrapper(<ListGigaLayer />)
    );
    expect(asFragment()).toMatchSnapshot();

  })

  test('render PreviewGigaLayer', async () => {
    const { getByTestId } = render(<PreviewGigaLayer isPreviewAvailable={true} />)
    expect(screen.getByText('Click on the button to see the preview on the Map.')).toBeInTheDocument()
    const button = getByTestId('data-layer-preview');
    await fireEvent.click(button);
    expect(screen.getByText('Preview')).toBeInTheDocument()
  })

  test("render with getDataPreviewFx is in pending state", () => {
    resetPreviewData();
    const spy = jest.spyOn(getDataPreviewFx.pending, 'getState');
    spy.mockReturnValue(true);
    void waitFor(() => {
      render(<PreviewGigaLayer isPreviewAvailable={true} />);
    });
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
    spy.mockRestore();
  })

  test('render PreviewGigaLayer with isPreviewAvailable=false', () => {
    render(<PreviewGigaLayer isPreviewAvailable={false} />)
    expect(screen.getByText('Preview not available.')).toBeInTheDocument()
  })

  test("render with getDataPreviewFx is in pending state", () => {
    const { getByTestId } = render(testWrapper(<PreviewGigaLayer isPreviewAvailable={true} />));
    const button = getByTestId('data-layer-preview');
    fireEvent.click(button);
    const spy = jest.spyOn(getDataPreviewFx.pending, 'getState');
    spy.mockReturnValue(true);
    render(<PreviewGigaLayer isPreviewAvailable={true} />);
    // expect(screen.getByText('Loading data...')).toBeInTheDocument();
    spy.mockRestore();
  })

  test("click on publish button ", () => {
    setLoggedInUser(loggedInUser as any)
    setCurrentGigaLayerItem(currentLayerMockWithDraftStaus as any)
    const { getByTestId } = render(testWrapper(<AdminViewLayer />));
    const button = getByTestId('giga-layer-ready-to-publish');
    fireEvent.click(button);
  })

  test("click on publish button ", () => {
    setLoggedInUser(loggedInUser as any)
    setCurrentGigaLayerItem(currentLayerMockWithReadyToPublishStaus as any)
    const handleClick = jest.fn();
    const { getByTestId } = render(testWrapper(<AdminViewLayer />));
    const button = getByTestId('giga-layer-publish');
    fireEvent.click(button);
  })

  test("submit Giga Layer form with static layer", async () => {
    const { container, debug, getByTestId } = render(testWrapper(<AddEditGigaLayer />));
    // upload icon;
    const file = new File(['icon'], 'icon.svg', { type: 'image/svg' });
    const fileInput = container.querySelector('#file-upload input') as HTMLInputElement;
    // empty file
    fireEvent.change(fileInput, { target: { files: '' } });
    fireEvent.change(fileInput, { target: { files: [] } });

    fireEvent.change(fileInput, { target: { files: [file] } });

    const name = container.querySelector('#layer-name') as HTMLInputElement;
    await fireEvent.change(name, { target: { value: 'Test' } });
    const description = container.querySelector('#layer-description') as HTMLInputElement;
    await fireEvent.change(description, { target: { value: 'Test' } });
    const layerype = container.querySelector('#layer-type-select') as HTMLSelectElement;
    await fireEvent.change(layerype, { target: { value: 'STATIC' } });
    const sourceType = container.querySelector('#source-type') as HTMLSelectElement;
    fireEvent.click(sourceType.querySelector('button') as Element);
    await fireEvent.click(sourceType.querySelector('.cds--list-box__menu-item') as Element);
    // await fireEvent.change(sourceType, { selectedItems: [DataSourceType.DAILY_CHECK_APP] });
    const apiSource = container.querySelector('#apiSource-select') as HTMLSelectElement;
    fireEvent.click(apiSource.querySelector('button') as Element);
    await fireEvent.click(apiSource.querySelector('.cds--list-box__menu-item') as Element);

    const parameter = container.querySelector('#parameter-select') as HTMLSelectElement;
    await fireEvent.change(parameter, { target: { value: 'connectivity_speed' } });

    const countries = container.querySelector('#country-select') as HTMLSelectElement;
    fireEvent.click(countries.querySelector('button') as Element);
    await fireEvent.click(countries.querySelector('.cds--list-box__menu-item') as Element);

    const legendName0 = container.querySelector('#legend-name-0') as HTMLInputElement;
    await fireEvent.change(legendName0, { target: { value: '5G/5G' } });
    const legendValue0 = container.querySelector('#legend-value-0') as HTMLInputElement;
    await fireEvent.change(legendValue0, { target: { value: 'Good' } });

    const legendName1 = container.querySelector('#legend-name-1') as HTMLInputElement;
    await fireEvent.change(legendName1, { target: { value: '5G/5G' } });
    const legendValue1 = container.querySelector('#legend-value-1') as HTMLInputElement;
    await fireEvent.change(legendValue1, { target: { value: 'Moderate' } });

    const legendName2 = container.querySelector('#legend-name-2') as HTMLInputElement;
    await fireEvent.change(legendName2, { target: { value: '5G/5G' } });
    const legendValue2 = container.querySelector('#legend-value-0') as HTMLInputElement;
    await fireEvent.change(legendValue2, { target: { value: 'Bad' } });

    const legendName3 = container.querySelector('#legend-name-3') as HTMLInputElement;
    await fireEvent.change(legendName3, { target: { value: '5G/5G' } });
    const legendValue3 = container.querySelector('#legend-value-3') as HTMLInputElement;
    await fireEvent.change(legendValue3, { target: { value: 'Good' } });
    //  update legends
    const submit = getByTestId('submit-giga-layer-form')
    await fireEvent.click(submit)
  })

  test("submit Giga Layer form with live layer", async () => {
    const { container, getByTestId } = render(testWrapper(<AddEditGigaLayer />));

    const name = container.querySelector('#layer-name') as HTMLInputElement;
    await fireEvent.change(name, { target: { value: 'Test' } });
    const description = container.querySelector('#layer-description') as HTMLInputElement;
    await fireEvent.change(description, { target: { value: 'Test' } });
    const layerype = container.querySelector('#layer-type-select') as HTMLSelectElement;
    await fireEvent.change(layerype, { target: { value: 'LIVE' } });
    const sourceType = container.querySelector('#source-type') as HTMLSelectElement;
    fireEvent.click(sourceType.querySelector('button') as Element);
    await fireEvent.click(sourceType.querySelector('.cds--list-box__menu-item') as Element);
    // await fireEvent.change(sourceType, { selectedItems: [DataSourceType.DAILY_CHECK_APP] });
    const apiSource = container.querySelector('#apiSource-select') as HTMLSelectElement;
    fireEvent.click(apiSource.querySelector('button') as Element);
    await fireEvent.click(apiSource.querySelector('.cds--list-box__menu-item') as Element);

    const parameter = container.querySelector('#parameter-select') as HTMLSelectElement;
    await fireEvent.change(parameter, { target: { value: 'connectivity_speed' } });

    const countries = container.querySelector('#country-select') as HTMLSelectElement;
    fireEvent.click(countries.querySelector('button') as Element);
    await fireEvent.click(countries.querySelector('.cds--list-box__menu-item') as Element);

    const selectUnit = container.querySelector('#unit-select') as HTMLSelectElement;
    await fireEvent.change(selectUnit, { target: { value: 'mbps' } });

    const benchmark = container.querySelector('#global-giga-benchmark') as HTMLInputElement;
    await fireEvent.change(benchmark, { target: { value: 200000 } });

    const submit = getByTestId('submit-giga-layer-form')
    await fireEvent.click(submit)
  })
})