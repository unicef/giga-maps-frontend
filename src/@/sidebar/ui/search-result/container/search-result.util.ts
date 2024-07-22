import { getId } from "~/lib/utils";

import { AdminType, Country, CountryWithDistrictCount } from "./search-result.type";

const collectSearchAdminData = ({ data, country, admin1, admin2, level }: { data?: CountryWithDistrictCount['data'], country: Country, admin1: AdminType[], admin2: AdminType[], level: number }, collector: AdminType[]) => {
  if (!data) return;
  Object.values(data).forEach(({ admin1_name: adminOneName, admin2_name: adminTwoName, data: nestedData, admin1_code: adminCode }) => {
    const districtData = {
      ...country,
      countryName: country.name,
      name: adminOneName ?? adminTwoName as string,
      level,
      adminCode
    }
    collector.push(districtData);
    collectSearchAdminData({ data: nestedData, country, admin1, admin2, level: 2 }, admin2);
  })
}


export const makeSearchDataCollection = (countries: CountryWithDistrictCount[]) => {
  const admin1 = [] as AdminType[];
  const admin2 = [] as AdminType[];
  const countryList = [] as Country[];
  const serchDataList = {
    countries: countryList,
    admin1,
    admin2
  }
  countries?.forEach(({ country_id: countryId, country_name: countryName, country_code: countryCode, data }) => {
    const country = {
      countryId,
      name: countryName,
      countryName,
      countryCode
    } as Country;
    countryList.push(country);
    collectSearchAdminData({ data, country, admin1, admin2, level: 1 }, admin1)
  });
  return serchDataList;
}

export const matchAndCollectItems = ({ data = [], query = '', type = '', maxCount = 2 }: { data: AdminType[] | Country[], query: string; type?: string; maxCount?: number; }) => {
  let currentCount = 0;
  const items = [];
  for (const item of data) {
    const name = item?.name?.toLocaleLowerCase() || "";
    const words = (name).split(' ');
    const matchingWords = words.filter(word => word.startsWith(query.toLowerCase()));
    if (matchingWords.length || name.startsWith(query.toLowerCase())) {
      items.push({
        ...item,
        id: getId(),
        type
      })
      currentCount += 1;
    }
    if (maxCount === currentCount) {
      break;
    }
  }
  return items;
}