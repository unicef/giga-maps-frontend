import { Information } from "@carbon/icons-react";
import { Tooltip } from "@carbon/react";
import { ReactElement } from "react";
import styled from "styled-components";

const AccordionItemTitleWrapper = styled.div`
  display:flex;
  align-items:center;

.graph{
fill:#fff;
width: 0.75rem;
height: 0.75rem;
margin-right:0.25rem;
}
button{
  border: none;
    background: inherit;
    margin-top: 0.3rem;
    svg{
      fill:#7E7E7E;
      width: 0.75rem;
      height: 0.75rem;
    }
}

`

export const AccordionItemTitle = ({ label, tooltipLabel }: { label: ReactElement, tooltipLabel: string }) => (
  <AccordionItemTitleWrapper>
    {label}
    <Tooltip align="top" label={tooltipLabel}>
      <button className="sb-tooltip-trigger" type="button">
        <Information />
      </button>
    </Tooltip>
  </AccordionItemTitleWrapper>
);