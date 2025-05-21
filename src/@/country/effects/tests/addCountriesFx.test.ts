import { describe, test, expect, jest } from '@jest/globals'
import { addCountriesFx } from '../add-countries-fx';
import { createSourceForAdminCountry } from '../../country.utils'
import { DEFAULT_SOURCE } from '~/@/map/map.constant';

jest.mock('../../country.utils', () => ({
  createSourceForAdminCountry: jest.fn(),
}))


describe('addCountriesFx', () => {
  let map: any;

  beforeEach(() => {
    map = {
      addSource: jest.fn(),
      getStyle: () => ({
        sources: {
          [DEFAULT_SOURCE]: true,
          layers: []
        }
      })
    };
  });

  test('should not call createSourceForAdminCountry when map is not provided', async () => {
    const result = await addCountriesFx({ map: null })
    expect(result).toBeUndefined();
  })

  test('should call createSourceForAdminCountry twice with correct parameters when map is provided', async () => {
    const mockMap = {} as any
    await addCountriesFx({ map: mockMap })

    expect(createSourceForAdminCountry).toHaveBeenCalledTimes(2)
  })
})
