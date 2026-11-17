import type { SchoolDataType } from '~/api/types';

type WithSchoolDataType =
  { school_data_type?: SchoolDataType } | null | undefined;

export const ENGAGED_SCHOOL_DATA_TYPE: SchoolDataType = 'government';

// A missing value means the backend does not send the field yet: keep the map as it was.
export const isEngagedCountry = (country: WithSchoolDataType): boolean =>
  !country?.school_data_type ||
  country.school_data_type === ENGAGED_SCHOOL_DATA_TYPE;

export const getEngagedCountryIds = (
  countries: ({ id: number } & NonNullable<WithSchoolDataType>)[] | null,
): number[] | null => {
  if (!countries?.some((country) => country.school_data_type)) return null;
  return countries
    .filter((country) => country.school_data_type === ENGAGED_SCHOOL_DATA_TYPE)
    .map((country) => country.id);
};

export const hasNonEngagedCountries = (
  countries: NonNullable<WithSchoolDataType>[] | null,
): boolean =>
  !!countries?.some(
    (country) =>
      country.school_data_type &&
      country.school_data_type !== ENGAGED_SCHOOL_DATA_TYPE,
  );
