import { useStore } from "effector-react";

import { $countryList, getCountryList } from "~/@/api-docs/models/explore-api.model";
import { CountryListType } from "~/@/api-docs/types/country-list.type";

import { CountryMultiSelect } from "../modals.style";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@carbon/react";

export default function CountryMultiDropdown({ countryHasSchool, onSelectCountry, filterCountries = [], ...others }: { readonly countryHasSchool?: boolean, readonly filterCountries?: string[], readonly onSelectCountry: (country: CountryListType[] & Record<string, any>) => void }) {
  const countryList = useStore($countryList)
  const [selectedItems, setSelectedItems] = useState<CountryListType[]>([]);
  const filteredCountryList = useMemo(() => filterCountries.length ? countryList.filter(country => filterCountries?.includes(country.iso3_format)) : countryList, [countryList, filterCountries]);
  const isSelectedAll = selectedItems.length === filteredCountryList.length;
  useEffect(() => {
    onSelectCountry(selectedItems ?? []);
  }, [selectedItems])

  useEffect(() => {
    getCountryList(!!countryHasSchool);
  }, [countryHasSchool]);

  return (<div style={{ width: "100%", position: "relative" }}>
    <CountryMultiSelect
      key={`country-list-${isSelectedAll}`}
      height={"8rem"}
      id="country-list"
      name="countryId"
      titleText="Select Country"
      placeholder={"Select Country"}
      items={filteredCountryList}
      itemToString={(item: any) => item?.name}
      initialSelectedItems={selectedItems}
      itemToElement={(item: CountryListType) => (
        <span>
          {item?.name}
        </span>
      )}
      onChange={({ selectedItems }: { selectedItems: CountryListType[] }) => {
        setSelectedItems(selectedItems);
      }}
      {...others}
    />
    <Button
      style={{ position: "absolute", top: "-.5rem", right: "0" }}
      kind="ghost"
      size="sm"

      onClick={() => {
        if (isSelectedAll) {
          setSelectedItems([]);
        } else {
          setSelectedItems(filteredCountryList);
        }
      }}
    >
      {isSelectedAll ? 'Clear all' : 'Select all'}
    </Button>
  </div>)
}