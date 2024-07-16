import { useStore } from "effector-react"
import React, { useEffect, useMemo, useState } from "react"

import { waitFor } from "~/lib/utils"

import { $currentMainStep, $currentSubStep } from "../../models/product-tour.model"
import { getTourBoxStyle, getTourData, tourData } from "../../product-tour.util"
import TourInstructionPopover from "../components/modal/tour-instruction-popover"
import { CenterPointer, CustomPopover, HighlightBox, TourStartOverlay } from "../styles/product-tour-styles"
import { ObjectType } from "~/core/global-types"
import { $isMobile } from "~/core/media-query"

const ProductTourMainView = () => {
  const isMobile = useStore($isMobile);
  const currentMainStep = useStore<number>($currentMainStep)
  const currentSubStep = useStore<number>($currentSubStep)
  const tourData = useMemo(() => {
    return getTourData({ isMobile })
  }, [isMobile])
  const { highlightBox, popupProps, popupOptions } = tourData[currentMainStep - 1]?.substeps[currentSubStep - 1]

  const isHighlightBox = !!highlightBox;
  const subStepsLength = tourData[currentMainStep - 1]?.substeps?.length;

  const [hightlightStyle, updateHightlightStyle] = useState<{ items: ObjectType[], position: ObjectType }>({ items: [], position: {} });


  async function checkAndUpdateStyling(highlightBox: any) {
    if (highlightBox.trigger) {
      await waitFor(100);
      highlightBox.trigger();
      await waitFor(100);
    }
    const style = getTourBoxStyle(highlightBox);
    updateHightlightStyle(style);
  }

  useEffect(() => {
    if (isHighlightBox) {
      void checkAndUpdateStyling(highlightBox)
    }
  }, [isHighlightBox, highlightBox])

  return (<>
    <CenterPointer className="center-pointer" />
    <TourStartOverlay>
      {
        (currentMainStep > 0) &&
        <CustomPopover open={true} $style={{ ...popupProps?.style, ...hightlightStyle?.position }} {...popupOptions}>
          {isHighlightBox && hightlightStyle?.items?.map((item, i) => <HighlightBox key={i} $style={{ ...item, ...highlightBox?.style }} />)}
          <TourInstructionPopover
            {...popupProps}
            totalSubStep={subStepsLength}
            nextButton={currentMainStep > 1}
            firstSubStep={currentSubStep == 1}
            lastSubStep={currentSubStep == (tourData[0]?.substeps.length)}
          />
        </CustomPopover>
      }
    </TourStartOverlay>
  </>)
}

export default ProductTourMainView