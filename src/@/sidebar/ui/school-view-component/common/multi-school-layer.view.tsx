import { useStore } from "effector-react";
import { useState, useCallback, PropsWithChildren } from "react";
import { $isLoadingSchoolView } from "~/@/sidebar/sidebar.model";
import MultiLoadingSchool from "./multi-loading-school.view";
import MultiSchoolCommonAccodion from "./multi-school-common-accodion.view";
import { SchoolStatsType } from "~/api/types";

const MultiSchoolLayerView = ({ schoolLength = 0, schoolLayerList }: PropsWithChildren<{ schoolLength?: number, schoolLayerList: SchoolStatsType[] | null }>) => {
  const [outerExpanded, setOuterExpanded] = useState(0);
  const isLoading = useStore($isLoadingSchoolView);
  const handleOuterAccordionChange = useCallback((index: number) => {
    if (index === outerExpanded) {
      setOuterExpanded(0)
    } else {
      setOuterExpanded(index);
    }
  }, [outerExpanded]);

  if (isLoading) {
    return <MultiLoadingSchool count={schoolLength} />
  }
  return schoolLayerList?.map((schoolDetails) => (
    <MultiSchoolCommonAccodion
      key={schoolDetails.id}
      schoolDetails={schoolDetails}
      isOpen={outerExpanded === schoolDetails.id}
      onToggle={() => handleOuterAccordionChange(schoolDetails.id)}
    ></MultiSchoolCommonAccodion>
  ))
}

export default MultiSchoolLayerView;