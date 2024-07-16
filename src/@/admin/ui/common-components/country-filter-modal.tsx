import { Button, Checkbox } from "@carbon/react";
import { useState } from "react";

import { CountryListType } from "~/@/api-docs/types/country-list.type";
import { Modal, ModalFooter, ModalHeader } from "~/@/common/modal";
import { $layerFilterFooterStyle } from "~/@/sidebar/ui/common-components/styles/layer-filter-modal.style";

import { Scroll } from '@/scroll';

import { $countryFilterModalStyle, $countrymodalHeadingStyle, CountryCheckboxWrapper } from "../styles/admin-styles";

const CountryFilterModal = ({ open, setOpen, list, filterValues, setFilterValues, updateList, name }:
  {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    list: CountryListType[],
    filterValues: number[],
    setFilterValues?: (a: number[]) => void,
    updateList: (values?: number[]) => void,
    name: string
  }) => {
  const [checkedValues, setCheckedValues] = useState<number[]>([]);
  const handleCheckboxChange = (countryId: number) => {
    const values = setFilterValues ? filterValues : checkedValues;

    const updatedFilterValues = values.includes(countryId)
      ? values.filter((id) => id !== countryId)
      : [...values, countryId] as number[];

    if (setFilterValues) {
      setFilterValues(updatedFilterValues)
    } else {
      setCheckedValues(updatedFilterValues)
    }
  }
  return (
    <>
      <Modal open={open} $containerStyle={$countryFilterModalStyle}
        preventCloseOnClickOutside id={`${name}-filter-modal`}
      >
        <ModalHeader title="Filter By Country"
          $headingStyle={$countrymodalHeadingStyle}
          closeModal={() => {
            setOpen(false)
          }}
        />
        <Scroll style={{ maxHeight: "calc(100vh - 6rem)" }}>
          <CountryCheckboxWrapper legendText="">
            {
              list?.map((country) => (
                <Checkbox
                  data-testid={`checkbox-country-${country.id}`}
                  key={country?.id}
                  labelText={country?.name}
                  id={`${name}-checkbox-${country?.id}`}
                  checked={setFilterValues ? filterValues.includes(country?.id) : checkedValues.includes(country?.id)}
                  onChange={() => handleCheckboxChange(country?.id)}
                />
              ))
            }
          </CountryCheckboxWrapper>
        </Scroll >
        <ModalFooter $style={$layerFilterFooterStyle}>
          <Button
            kind="secondary"
            data-testid='reset-country-filter'
            onClick={() => {
              if (setFilterValues) {
                setFilterValues([]);
              } else {
                setCheckedValues([]);
              }
              updateList([])
              setOpen(false);
            }}>
            Reset
          </Button>
          <Button
            kind="primary"
            onClick={() => {
              updateList(checkedValues)
              setOpen(false);
            }}>
            Apply
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

export default CountryFilterModal