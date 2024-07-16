import { ExploreApiType } from "../types/explore-api-type"

export const checkCountryFilter = (data: ExploreApiType) => {
  return data?.country_filter_applicable
}

export const checkSchoolFilter = (data: ExploreApiType) => {
  return data?.school_filter_applicable
}

export const checkDateRangeFilter = (data: ExploreApiType) => {
  return data?.date_range_filter_applicable
}

export const checkIndicatorFilter = (data: ExploreApiType) => {
  return data?.indicator_filter_applicable
}

export const checkGigaFilter = (data: ExploreApiType) => {
  return data?.giga_id_filter_applicable
}

export const isPublic = (category: string) => category === 'public';

export const isPrivate = (category: string) => category === 'private';

export const getCardAllProps = (card: ExploreApiType | null) => {
  if (!card) return {};
  return {
    isUnblock: card.is_unlocked,
    isPublic: isPublic(card.category),
    isPrivate: isPublic(card.category),
    isCountry: checkCountryFilter(card),
    isSchool: checkSchoolFilter(card),
    isDate: checkDateRangeFilter(card),
    isGiga: checkGigaFilter(card),
    isIndicator: checkIndicatorFilter(card)
  }
}

export const readFileResponse = async ({ data: blob }: { data: string; }) => {

  // Create an Object URL from the Blob
  return {
    blob,
  };
}