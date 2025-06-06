import { defaultWorldView } from '~/@/map/map.constant'
import { getUserCurrentCountryISOFx } from '../detect-country-iso'
import { setLocalStorage } from '~/lib/utils'
import { mapboxWorldviewsBoundaries } from '../../country.constant'


jest.mock('~/lib/utils')

describe('getUserCurrentCountryISOFx', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    global.fetch = jest.fn()
  })

  it('should return defaultWorldView when fetch fails', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'))

    const result = await getUserCurrentCountryISOFx()

    expect(result).toBe(defaultWorldView)
  })

  it('should return country ISO when it is in mapboxWorldviewsBoundaries', async () => {
    const mockCountryISO = mapboxWorldviewsBoundaries[0];
    (global.fetch as jest.Mock).mockResolvedValue({
      text: jest.fn().mockResolvedValue(mockCountryISO),
    })

    const result = await getUserCurrentCountryISOFx()

    expect(result).toBe(mockCountryISO)
    expect(setLocalStorage).toHaveBeenCalledWith('countryISO', mockCountryISO)
  })

  it('should return "CN" for Hong Kong', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      text: jest.fn().mockResolvedValue('HK'),
    })

    const result = await getUserCurrentCountryISOFx()

    expect(result).toBe('CN')
    expect(setLocalStorage).toHaveBeenCalledWith('countryISO', 'CN')
  })

  it('should return "CN" for Macau', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      text: jest.fn().mockResolvedValue('MO'),
    })

    const result = await getUserCurrentCountryISOFx()

    expect(result).toBe('CN')
    expect(setLocalStorage).toHaveBeenCalledWith('countryISO', 'CN')
  })

  it('should return defaultWorldView for country not in mapboxWorldviewsBoundaries', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      text: jest.fn().mockResolvedValue('XX'),
    })

    const result = await getUserCurrentCountryISOFx()

    expect(result).toBe(defaultWorldView)
    expect(setLocalStorage).toHaveBeenCalledWith('countryISO', defaultWorldView)
  })

})
