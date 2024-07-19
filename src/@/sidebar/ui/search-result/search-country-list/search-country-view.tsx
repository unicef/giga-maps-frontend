import { useStore } from "effector-react"
import { useMemo } from "react";

import { CountryIntegrationStatusColor } from "~/@/country/country.constant";
import { mapCountry } from "~/core/routes";
import { Link } from "~/lib/router";

import { $currentExpandCountry, $searchSchoolIds, setSearchCountryExpand } from '../container/search-result.model';
import { CountryWithDistrictCount } from "../container/search-result.type";
import { ChevronDownIcon, ChevronUpIcon, Dot, LeftItem, LinkItem, RightItem, SearchItem } from "../styles/search-result-style"
import { SearchDistrict } from "./search-district-view"


export const expandCountry = (countryId: string, isExpanded: boolean) => {
  setSearchCountryExpand(isExpanded ? "" : countryId);
}

export const SearchCountry = ({ countryData }: { countryData: CountryWithDistrictCount }) => {
  const countryId = useStore($currentExpandCountry);
  const isSchoolsSelected = useStore($searchSchoolIds).size > 0;

  const { country_id: id, integration_status: integrationStatus, country_name: name, admin1_count: districtCount, data, country_code: code }
    = countryData;
  const districtsList = useMemo(() => Object.values(data), [data]);
  const isExpanded = countryId === id?.toString();
  const districtName = districtCount >= 1 ? districtsList[0].admin1_description_ui_label : "District"
  return (
    <>
      <SearchItem
        $border={!isExpanded}>
        <LeftItem $bold={isExpanded}>
          <Dot $color={CountryIntegrationStatusColor[integrationStatus]} style={{ left: '-1.2rem', top: '0.5rem', position: 'absolute' }} />
          <Link to={mapCountry} params={{ code: code.toLowerCase() }}>
            {name}
          </Link>
          {isExpanded && isSchoolsSelected && <Dot />}
        </LeftItem>
        <RightItem onClick={() => {
          expandCountry(String(id), isExpanded)
        }}>
          <LinkItem $highlight={isExpanded}>{districtCount} {districtName || "District"}</LinkItem>
          {isExpanded ? <ChevronUpIcon $highlight={isExpanded} /> :
            <ChevronDownIcon />}
        </RightItem>
      </SearchItem>
      {
        isExpanded &&
        !!districtsList?.length &&
        districtsList?.map((district, index) => (
          <SearchDistrict
            key={`${district.school_count}-${index}`}
            districtData={district}
            countryId={countryId}
            code={code}
          />
        ))
      }
    </>
  )
}
