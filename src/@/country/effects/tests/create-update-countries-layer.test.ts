import { createUpdateCountriesLayer } from '../create-update-countries-layer'
import { CountryAdminLevel } from '../../country.constant'
import * as countryUtils from '../../country.utils'

vi.mock('../../country.utils', () => ({
  createFillLayerForCountry: vi.fn(),
  createLineLayerForCountry: vi.fn(),
  addAdminCountryLayerEvents: vi.fn(),
  onChangeLabelLayer: vi.fn(),
  onChangeAdminBoundariesLayer: vi.fn(),
  applyWorldViewToLabels: vi.fn(),
}))

describe('createUpdateCountriesLayer', () => {
  const mockMap = {} as any
  const mockProps = {
    map: mockMap,
    isTilesAndLables: true,
    isAdminBoundaries: true,
    paintData: {},
    selectedLevel: 0,
    levelsCode: ['US'],
    worldView: 'US',
    style: 'default',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should not call any functions if map is not provided', async () => {
    await createUpdateCountriesLayer({ ...mockProps, map: undefined })

    expect(countryUtils.createFillLayerForCountry).not.toHaveBeenCalled()
    expect(countryUtils.createLineLayerForCountry).not.toHaveBeenCalled()
    expect(countryUtils.addAdminCountryLayerEvents).not.toHaveBeenCalled()
    expect(countryUtils.onChangeLabelLayer).not.toHaveBeenCalled()
    expect(countryUtils.onChangeAdminBoundariesLayer).not.toHaveBeenCalled()
  })

  it('should call functions for both admin levels when map is provided', async () => {
    (countryUtils.createFillLayerForCountry as vi.Mock).mockReturnValue({ isLayerCreated: true })

    await createUpdateCountriesLayer(mockProps)

    expect(countryUtils.createFillLayerForCountry).toHaveBeenCalledTimes(2)
    expect(countryUtils.createLineLayerForCountry).toHaveBeenCalledTimes(2)
    expect(countryUtils.addAdminCountryLayerEvents).toHaveBeenCalledTimes(2)
    expect(countryUtils.onChangeLabelLayer).toHaveBeenCalledTimes(2)
    expect(countryUtils.onChangeAdminBoundariesLayer).toHaveBeenCalledTimes(2)

    expect(countryUtils.createFillLayerForCountry).toHaveBeenCalledWith({ ...mockProps, level: CountryAdminLevel.level0 })
    expect(countryUtils.createFillLayerForCountry).toHaveBeenCalledWith({ ...mockProps, level: CountryAdminLevel.level1 })
  })

  it('should not call addAdminCountryLayerEvents if isLayerCreated is false', async () => {
    (countryUtils.createFillLayerForCountry as vi.Mock).mockReturnValue({ isLayerCreated: false })

    await createUpdateCountriesLayer(mockProps)

    expect(countryUtils.addAdminCountryLayerEvents).not.toHaveBeenCalled()
  })

  it('should call onChangeLabelLayer with correct parameters', async () => {
    await createUpdateCountriesLayer(mockProps)

    expect(countryUtils.onChangeLabelLayer).toHaveBeenCalledWith(mockMap, true)
  })

  it('should call onChangeAdminBoundariesLayer with correct parameters', async () => {
    await createUpdateCountriesLayer(mockProps)

    expect(countryUtils.onChangeAdminBoundariesLayer).toHaveBeenCalledWith(mockMap, true)
  })
})

