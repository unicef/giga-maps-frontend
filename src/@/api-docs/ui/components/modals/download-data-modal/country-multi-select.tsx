import { useStore } from "effector-react";

import { $countryList, getCountryList } from "~/@/api-docs/models/explore-api.model";
import { CountryListType } from "~/@/api-docs/types/country-list.type";

import { CountryMultiSelect } from "../modals.style";
import { useEffect, useState } from "react";
import { Button } from "@carbon/react";

export default function CountryMultiDropdown({ countryHasSchool, onSelectCountry, ...others }: { readonly countryHasSchool?: boolean, readonly onSelectCountry: (country: CountryListType[] & Record<string, any>) => void }) {
  const countryList = useStore($countryList)
  const [selectedItems, setSelectedItems] = useState<CountryListType[]>([]);
  const isSelectedAll = selectedItems.length === countryList.length;
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
      items={countryList}
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
          setSelectedItems(countryList);
        }
      }}
    >
      {isSelectedAll ? 'Clear all' : 'Select all'}
    </Button>
  </div>)
}