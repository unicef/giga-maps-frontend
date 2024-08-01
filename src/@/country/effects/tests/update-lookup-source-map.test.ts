import { Map } from 'mapbox-gl'
import { updateLookupSourceForAdmin0, updateLookupSourceForAdmin1 } from '../update-lookup-source-map'
import { Country, CountryBasic } from '~/api/types'

jest.mock('../../country.model')

describe('updateLookupSourceForAdmin0', () => {
  let map: jest.Mocked<Map>
  let countries: CountryBasic[]

  beforeEach(() => {
    map = {
      getSource: jest.fn(),
      addSource: jest.fn(),
      removeSource: jest.fn(),
      setFeatureState: jest.fn(),
    } as any

    countries = [
      { id: 1, name: 'Country 1', code: 'C1' },
      { id: 2, name: 'Country 2', code: 'C2' },
    ]
  })

  it('should return early if map is null', async () => {
    await updateLookupSourceForAdmin0({ map: null, countries })
    expect(map.getSource).not.toHaveBeenCalled()
    expect(map.addSource).not.toHaveBeenCalled()
    expect(map.removeSource).not.toHaveBeenCalled()
  })

  it('should return early if countries is null', async () => {
    await updateLookupSourceForAdmin0({ map, countries: null })
    expect(map.getSource).not.toHaveBeenCalled()
    expect(map.addSource).not.toHaveBeenCalled()
    expect(map.removeSource).not.toHaveBeenCalled()
  })

  it('should setFeatureState', async () => {
    map.setFeatureState.mockReturnValue({} as any)
    await updateLookupSourceForAdmin0({ map, countries })
  })
})

describe('updateLookupSourceForAdmin1', () => {
  let map: jest.Mocked<Map>
  let admin1List: Country['admin1_metadata']

  beforeEach(() => {
    map = {
      getSource: jest.fn(),
      addSource: jest.fn(),
      removeSource: jest.fn(),
      setFeatureState: jest.fn(),
    } as any

    admin1List = [
      { id: 1, name: 'Admin1' },
      { id: 2, name: 'admin2' },
    ]
  })

  it('should return early if map is null', async () => {
    await updateLookupSourceForAdmin1({ map: null, admin1List })
    expect(map.getSource).not.toHaveBeenCalled()
    expect(map.addSource).not.toHaveBeenCalled()
    expect(map.removeSource).not.toHaveBeenCalled()
  })

  it('should return early if countries is null', async () => {
    await updateLookupSourceForAdmin1({ map, admin1List: null })
    expect(map.getSource).not.toHaveBeenCalled()
    expect(map.addSource).not.toHaveBeenCalled()
    expect(map.removeSource).not.toHaveBeenCalled()
  })

  it('should setFeatureState', async () => {
    map.setFeatureState.mockReturnValue({} as any)
    await updateLookupSourceForAdmin1({ map, admin1List })
    expect(map.setFeatureState).toHaveBeenCalled();
  })
})
