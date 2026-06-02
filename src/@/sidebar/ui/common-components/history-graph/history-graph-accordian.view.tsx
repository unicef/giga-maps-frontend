import { SchoolStatsType } from '~/api/types';

import HistoryGraph from './history-graph.view';

export function HistoryGraphAccordian({
  schoolData,
  isLoading,
}: {
  readonly schoolData?: SchoolStatsType;
  readonly isLoading?: boolean;
}) {
  return (
    // <div className="mx-4!">
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
    // </div>
    <div className="mx-4!">
      <HistoryGraph
        isChartOpen={true}
        schoolData={schoolData}
        isLoading={isLoading}
      />
    </div>
  );
}
