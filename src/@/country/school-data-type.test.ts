import {
  getEngagedCountryIds,
  hasNonEngagedCountries,
  isEngagedCountry,
} from './school-data-type';

describe('school data type', () => {
  test('a government country is engaged, OSM and not mapped are not', () => {
    expect(isEngagedCountry({ school_data_type: 'government' })).toBe(true);
    expect(isEngagedCountry({ school_data_type: 'osm' })).toBe(false);
    expect(isEngagedCountry({ school_data_type: 'not_mapped' })).toBe(false);
  });

  test('a country without the field counts as engaged', () => {
    expect(isEngagedCountry({})).toBe(true);
    expect(isEngagedCountry(null)).toBe(true);
  });

  test('lists the ids of government countries only', () => {
    expect(
      getEngagedCountryIds([
        { id: 1, school_data_type: 'government' },
        { id: 2, school_data_type: 'osm' },
        { id: 3, school_data_type: 'not_mapped' },
        { id: 4, school_data_type: 'government' },
      ]),
    ).toEqual([1, 4]);
  });

  test('returns null when no country carries the field yet', () => {
    expect(getEngagedCountryIds([{ id: 1 }, { id: 2 }])).toBeNull();
    expect(getEngagedCountryIds(null)).toBeNull();
  });

  test('returns an empty list when the field exists but nobody is engaged', () => {
    expect(getEngagedCountryIds([{ id: 1, school_data_type: 'osm' }])).toEqual(
      [],
    );
  });

  test('detects non-engaged countries only when the field is present', () => {
    expect(
      hasNonEngagedCountries([
        { school_data_type: 'government' },
        { school_data_type: 'osm' },
      ]),
    ).toBe(true);
    expect(hasNonEngagedCountries([{ school_data_type: 'government' }])).toBe(
      false,
    );
    expect(hasNonEngagedCountries([{}, {}])).toBe(false);
    expect(hasNonEngagedCountries(null)).toBe(false);
  });
});
