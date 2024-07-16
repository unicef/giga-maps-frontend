import { useStore } from "effector-react";
import { useEffect, useRef, useState } from "react";

import { SchoolListType } from "~/@/api-docs/types/explore-api-type";

import { SelectContainer } from "../modals.style";
import { $selectedSchools, setSearchSchool, setSelectedSchool } from "./download-data.model";

export default function DownloadSchoolDropDown({ schoolList }: { schoolList: SchoolListType[] }) {
  const inputTimeout = useRef<ReturnType<typeof setTimeout>>();
  const selectedSchools = useStore($selectedSchools)
  const selectedSchoolLength = selectedSchools.length > 0;
  const placeholder = selectedSchoolLength ? "Search School" : "All School"
  return (<>
    <SelectContainer
      required
      titleText="Select Schools (type minimum 2 letters to get results)"
      id={`school-select`}
      name="school_ids"
      items={schoolList}
      itemToString={(item: SchoolListType) => item?.name}
      itemToElement={(item: SchoolListType) => (
        <span>
          {item?.name}
        </span>
      )}
      onInputValueChange={(value: string) => {
        if (!value) {
          return;
        }
        inputTimeout.current = setTimeout(() => {
          setSearchSchool(value)
        }, 10)
      }}
      onChange={({ selectedItems }: { selectedItems: SchoolListType[] }) => {
        clearTimeout(inputTimeout.current);
        setSelectedSchool(selectedItems)
      }}
      placeholder={placeholder} />

  </>)
}