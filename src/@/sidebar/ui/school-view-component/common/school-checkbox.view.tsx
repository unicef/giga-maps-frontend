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
  return (<CheckBoxContainer>
    <Checkbox
      labelText=""
      id={String(id)}
      defaultChecked={true}
      onChange={() => {
        onSchoolUncheck(id);
      }}
    />
  </CheckBoxContainer>)
}

export default SchoolCheckbox;