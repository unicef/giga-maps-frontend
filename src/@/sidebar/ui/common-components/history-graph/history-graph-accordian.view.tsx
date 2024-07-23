import { useState } from "react";
import styled from "styled-components";

import { SchoolStatsType } from "~/api/types";

import HistoryGraph from "./history-graph.view";

const ProgressGraphWrapper = styled.div`
    margin: 0rem 1rem 0rem 1rem;

`

export function HistoryGraphAccordian({ schoolData, isLoading }: { readonly schoolData?: SchoolStatsType; readonly isLoading?: boolean }) {
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