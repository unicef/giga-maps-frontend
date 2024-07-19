import { describe, test, expect, jest } from '@jest/globals'
import { zoomToCountryFx } from '../zoom-to-country-fx'
import { defaultCenter, defaultZoom } from '~/@/map/map.constant'

describe('zoomToCountryFx', () => {
  let map: any

  beforeEach(() => {
    map = {
      flyTo: jest.fn(),
      fitBounds: jest.fn(),
    }
  })

  test('should return empty string when map is not provided', async () => {
    const result = await zoomToCountryFx({ map: null } as any)
    expect(result).toBe('')
  })

  test('should zoom to school focus when provided', async () => {
    const schoolFocusLatLng = [10, 20]
    const result = await zoomToCountryFx({ map, schoolFocusLatLng, levelsCode: ['US'] } as any)
    expect(map.flyTo).toHaveBeenCalledWith({
      center: schoolFocusLatLng,
      zoom: 10,
    })
    expect(result).toBe(schoolFocusLatLng.toString())
  })

  test('should return zoomedCountryCode when it matches adminCode', async () => {
    const zoomedCountryCode = 'US'
    const result = await zoomToCountryFx({ map, zoomedCountryCode, levelsCode: ['US'] } as any)
    expect(result).toBe(zoomedCountryCode)
  })

  test('should fit bounds for admin1 when admin1Code is provided', async () => {
    const country = {
      code: 'US',
      admin1_metadata: [{ giga_id_admin: 'CA', bbox: [1, 2, 3, 4] }],
    }
    const result = await zoomToCountryFx({ map, country, levelsCode: ['US', 'CA'], isMobile: false } as any)
    expect(map.fitBounds).toHaveBeenCalledWith([1, 2, 3, 4], expect.any(Object))
    expect(result).toBe('CA')
  })

  test('should fit bounds for country when only countryCode is provided', async () => {
    const country = {
      code: 'US',
      admin_metadata: { bbox: [1, 2, 3, 4] },
    }
    const result = await zoomToCountryFx({ map, country, levelsCode: ['US'], isMobile: true } as any)
    expect(map.fitBounds).toHaveBeenCalledWith([1, 2, 3, 4], expect.any(Object))
    expect(result).toBe('US')
  })

  test('should return to global view when no adminCode is provided', async () => {
    const result = await zoomToCountryFx({ map, levelsCode: [], zoomedCountryCode: 'US' } as any)
    expect(map.flyTo).toHaveBeenCalledWith({
      center: defaultCenter,
      zoom: defaultZoom,
    })
    expect(result).toBe('map')
  })

  test('should return zoomedCountryCode when country does not match countryCode', async () => {
    const zoomedCountryCode = 'US'
    const result = await zoomToCountryFx({ map, country: { code: 'CA' }, zoomedCountryCode, levelsCode: ['US'] } as any)
    expect(result).toBe(zoomedCountryCode)
  })
})
