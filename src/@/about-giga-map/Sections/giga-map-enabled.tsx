import { ChevronLeft, ChevronRight } from '@carbon/icons-react'
import { Button } from '@carbon/react';
import { combine, createEvent, createStore, restore } from 'effector';
import { useStore } from 'effector-react';
import { useEffect } from 'react';

import { AboutType, Content } from '../about.type';
import { CaseStudiesOneCardsContainer, CaseStudiesOneWrapper, CaseStudyImageSection, CaseStudyInfoSection, CaseStudySliderSection, RightAndLeftWrapper } from "../styles/about-giga-map-styles"

const onChange = createEvent<number>()
const $currentIndex = restore(onChange, 0)
const $columns = createStore(1);
const updateTotalItems = createEvent<number>();
const $totalItems = restore(updateTotalItems, 0);

const $carousel = combine(
  $currentIndex, $columns, $totalItems
  , (current, maxColumns, totalItems) => ({
    current,
    maxColumns,
    totalItems,
    totalSlides: Math.round(totalItems / maxColumns),
    isNext: Math.round(totalItems / maxColumns) - 1 <= current,
    isPrev: current > 0
  }))



function GigaMapEnbled({ data }: { data: AboutType }) {

  const { current, maxColumns, isNext, isPrev } = useStore($carousel);

  const handlePrev = () => {
    onChange(current - 1);
  };

  const handleNext = () => {
    onChange(current + 1);
  };

  useEffect(() => {
    if (data && data?.content) {
      updateTotalItems(data?.content.length);
    }
  }, [data]);

  return (
    <RightAndLeftWrapper $style={data.style}>
      <Button kind='ghost' className='left' renderIcon={ChevronLeft} onClick={handlePrev} disabled={!isPrev}></Button>
      <CaseStudiesOneWrapper>
        <CaseStudiesOneCardsContainer pos={current * 100}>
          {
            data?.content.map((singleSlide: Content, index: number) => (
              <CaseStudySliderSection key={index} column={maxColumns} $style={singleSlide.style}>
                <CaseStudyImageSection>
                  <img src={singleSlide?.image} />
                </CaseStudyImageSection>
                <CaseStudyInfoSection>
                  <p>
                    {singleSlide?.text?.[1]}
                  </p>
                  <h3>{singleSlide?.title}​</h3>
                  <h5>{singleSlide?.text?.[0]}</h5>
                </CaseStudyInfoSection>
              </CaseStudySliderSection>
            ))
          }
        </CaseStudiesOneCardsContainer>
      </CaseStudiesOneWrapper>
      <Button kind='ghost' className='right' renderIcon={ChevronRight} onClick={handleNext} disabled={isNext}></Button>
    </RightAndLeftWrapper>
  )
}

export default GigaMapEnbled