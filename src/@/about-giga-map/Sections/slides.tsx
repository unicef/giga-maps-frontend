
import { ArrowRight, ChevronLeft, ChevronRight } from '@carbon/icons-react'
import { Button, Link } from '@carbon/react';
import { combine, createEvent, createStore, restore } from "effector";
import { useStore } from "effector-react";
import { useEffect } from 'react';

import { AboutType } from '../about.type';
import CaseStudyCard from "../common/case-study-card"
import { CaseStudiesCardsContainer, CaseStudiesWrapper, GigaBlogWrapper, RightAndLeftWrapper, SliderWrapper } from "../styles/about-giga-map-styles"
import { $isMobile, $isTablet } from '~/core/media-query';

const onChange = createEvent<number>()
const $currentIndex = restore(onChange, 0)
const updateColumn = createEvent<number>();
const $columns = restore(updateColumn, 3);
const updateTotalItems = createEvent<number>();
const $totalItems = restore(updateTotalItems, 0);

const $carousel = combine(
  $currentIndex, $columns, $totalItems
  , (current, maxColumns, totalItems) => ({
    current,
    maxColumns,
    totalItems,
    totalSlides: Math.ceil(totalItems / maxColumns),
    isNext: Math.ceil(totalItems / maxColumns) - 1 > current,
    isPrev: current > 0
  }))

const Sliders = ({ data }: { data: AboutType }) => {
  const { current, maxColumns, isNext, isPrev } = useStore($carousel);
  const isMobile = useStore($isMobile);
  const isTablet = useStore($isTablet);
  const handlePrev = () => {
    onChange(current - 1);
  };

  useEffect(() => {
    if (data && data?.content) {
      updateTotalItems(data?.content.length);
      updateColumn(isMobile ? 1 : isTablet ? 2 : 3);
    }
  }, [data, isMobile, isTablet]);

  const handleNext = () => {
    onChange(current + 1);
  };

  return (
    <SliderWrapper $style={data.style}>
      <RightAndLeftWrapper>
        <Button kind='ghost' className='left' renderIcon={ChevronLeft} onClick={handlePrev} disabled={!isPrev}></Button>
        <CaseStudiesWrapper>
          <CaseStudiesCardsContainer pos={current * 100}>
            {data?.content.map((resouce, index) => (
              <CaseStudyCard
                key={index}
                column={maxColumns}
                cardPoster={resouce?.image}
                title={resouce?.title}
                description={resouce?.text[0]}
              />
            ))
            }
          </CaseStudiesCardsContainer>
        </CaseStudiesWrapper>
        <Button kind='ghost' className='right' renderIcon={ChevronRight} onClick={handleNext} disabled={!isNext}></Button>
      </RightAndLeftWrapper>
    </SliderWrapper>
  )
}

export default Sliders;