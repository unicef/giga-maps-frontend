import { useStore } from "effector-react";

import { $currentSelectedApiData } from "~/@/api-docs/models/explore-api.model";
import { CountryListType } from "~/@/api-docs/types/country-list.type";
import { getCardAllProps } from "~/@/api-docs/utils";

import { SelectCountry } from "../modals.style";
import { $selectedCountry, setCountryItem } from "./download-data.model";

export default function DownloadCountryDropDown(
  { countryList }: { countryList: CountryListType[] }) {

  const selectedCountry = useStore($selectedCountry);
  const placeholder = !selectedCountry ? "All Country" : "Select Country"
  const exploreApiData = useStore($currentSelectedApiData);
  const { isSchool } = getCardAllProps(exploreApiData);

  return (
    <SelectCountry
      height={isSchool ? "10rem" : "5rem"}
      id="country-list"
      name="countryId"
      titleText="Select Country"
      placeholder={placeholder}
      items={countryList}
      itemToString={(item) => item?.name}
      itemToElement={(item) => (
        <span>
          {item?.name}
        </span>
      )}
      onChange={({ selectedItem }: { selectedItem: CountryListType }) => {
        setCountryItem(selectedItem);
      }}
    />)
}