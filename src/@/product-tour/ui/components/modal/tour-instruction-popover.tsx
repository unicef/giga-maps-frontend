import { ChevronLeft, ChevronRight } from '@carbon/icons-react'
import { Button } from '@carbon/react';
import { useStore } from 'effector-react';
import { useMemo } from 'react';
import { useTheme } from 'styled-components';

import { map } from "~/core/routes";
import { Link } from "~/lib/router";

import { $currentSubStep, onChangeCurrentSubStep, onChangeTourEndPopup, onChangeTourStarted, onChangeTourStartPopup } from "../../../models/product-tour.model";
import { ActionWrapper, ClonedContainer, CurrentStepNumber, NextPreviousWrapper, PopoverContentBox, PopoverDescription, SubStepsContainer, SubStepsDots } from "../../styles/product-tour-styles";
import { onShowLegend, onShowThemeLayer } from '~/@/sidebar/sidebar.model';


const CloneItem = ({ target }: { target: string }) => {
  const findElement = useMemo(() => {
    const element = document.querySelector(target);
    if (element) {
      return element.cloneNode(true) as HTMLElement;
    }
    return null;
  }, [target])


  if (!findElement) return null;
  return (
    <ClonedContainer dangerouslySetInnerHTML={{ __html: findElement?.outerHTML ?? '' }} />
  )
}

const TourInstructionPopover = (
  { totalSubStep, title,
    lastSubStep, firstSubStep, content = [] }:
    {
      totalSubStep: number; title: string;
      lastSubStep: boolean; firstSubStep: boolean;
      content: { type: string, value: string }[]
    }) => {
  const theme = useTheme();

  const arrayForDots = Array.from({ length: totalSubStep }, (_, index) => index);
  const currentSubStep = useStore($currentSubStep);

  return (
    <PopoverContentBox className='popover-content-box'>
      <CurrentStepNumber>
        {title}
      </CurrentStepNumber>
      {content.map((item, index) => {
        if (item.type === 'text') {
          return <PopoverDescription key={`${item.type}-${index}`}>
            {item.value}
          </PopoverDescription>
        }
        if (item.type === 'clone') {
          return <CloneItem key={`${item.type}-${index}`} target={item.value} />
        }
        return null;
      }
      )}
      <SubStepsContainer>
        {
          arrayForDots.map((item, index) => {
            return (
              <SubStepsDots key={item}
                color={item + 1 <= currentSubStep ? theme.text : "#9E9E9E"}>
              </SubStepsDots>
            )
          })
        }
      </SubStepsContainer>
      <ActionWrapper>
        <Link to={map}>
          <Button
            size='sm'
            kind="ghost"
            onClick={() => {
              onShowLegend(false);
              onShowThemeLayer(false)
              onChangeTourStarted(false)
            }}
          > Skip Tour
          </Button>
        </Link>
        <NextPreviousWrapper>
          {!firstSubStep && <Button
            size='sm'
            kind='ghost'
            className='previous'
            iconDescription="previous"
            hasIconOnly renderIcon={ChevronLeft}
            onClick={
              () => {
                if (firstSubStep) {
                  onChangeTourStarted(false)
                  onChangeTourStartPopup(true)
                }
                onChangeCurrentSubStep(currentSubStep - 1)
              }} >
          </Button>}
          <Button
            size='sm'
            className='next'
            hasIconOnly
            renderIcon={ChevronRight}
            iconDescription="Next"
            onClick={() => {
              if (lastSubStep) {
                onChangeTourStarted(false)
                onChangeTourEndPopup(true)
              }
              onChangeCurrentSubStep(currentSubStep + 1)
            }} >
          </Button>
        </NextPreviousWrapper>
      </ActionWrapper>
    </PopoverContentBox>
  )
}

export default TourInstructionPopover