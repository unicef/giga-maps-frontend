import { Checkbox } from "@carbon/react";
import { styled } from "styled-components";

import { SchoolStatsType } from "~/api/types";

import { onSchoolUncheck } from "../../../sidebar.model";

const CheckBoxContainer = styled.div`
  position: absolute;
  top: 0.9rem;
  left: 0.5rem;
  z-index: 2;
  margin-right: 0.5rem;
  .cds--checkbox:checked+.cds--checkbox-label::before{
    border: 1px solid ${props => props.theme.text};
    border-width: 1px;
    background-color: ${props => props.theme.text};
  }
  .cds--checkbox-label::after {
        border-block-end: 1.5px solid  ${props => props.theme.main};
    border-inline-start: 1.5px solid ${props => props.theme.main};
  }
`

const SchoolCheckbox = ({ schoolDetails }: { schoolDetails: SchoolStatsType }) => {
  const { id } = schoolDetails;
  return (
    <Checkbox
      className="relative! mr-2! h-4! w-4! shrink-0! cursor-pointer! appearance-none! rounded-sm! border! border-gray-400! bg-white! after:absolute! after:left-[4px]! after:top-px! after:hidden! after:h-[9px]! after:w-[5px]! after:rotate-45! after:border-b-[1.5px]! after:border-r-[1.5px]! after:border-black! after:content-['']! checked:after:block!"

      labelText=""
      id={String(id)}
      defaultChecked={true}
      onChange={() => {
        onSchoolUncheck(id);
      }}
    />
  )
}

export default SchoolCheckbox;