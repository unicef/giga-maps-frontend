import { ChartColumn, } from "@carbon/icons-react";
import { AccordionItem } from "@carbon/react";
import { useState } from "react";
import styled from "styled-components";

import { SchoolStatsType } from "~/api/types";

import { AccordionItemTitle } from "../../global-and-country-view-components/common/accordion-item-title.view";
import { AccordionDistribution } from "../../sidebar.style";
import HistoryGraph from "./history-graph.view";

const ProgressGraphWrapper = styled.div`
    margin: 0rem 1rem 0rem 1rem;

`

export function HistoryGraphAccordian({ schoolData, isLoading }: { schoolData?: SchoolStatsType; isLoading?: boolean }) {
  const [show, setShow] = useState(true);
  return (
    // <ProgressGraphWrapper>
    //   <AccordionDistribution>
    //     <AccordionItem
    //       title={
    //         <AccordionItemTitle
    //           label=
    //           {
    //             <>
    //               {/* <ChartColumn className="graph" /> */}
    //               Progress graph
    //             </>
    //           }
    //           tooltipLabel="Progress graph" />}
    //       open={show}
    //       onHeadingClick={() => setShow((prev) => !prev)}>
    //       <HistoryGraph isChartOpen={true} schoolData={schoolData} isLoading={isLoading} />
    //     </AccordionItem>
    //   </AccordionDistribution>
    // </ProgressGraphWrapper>
    <ProgressGraphWrapper><HistoryGraph isChartOpen={true} schoolData={schoolData} isLoading={isLoading} /></ProgressGraphWrapper>
  )
}