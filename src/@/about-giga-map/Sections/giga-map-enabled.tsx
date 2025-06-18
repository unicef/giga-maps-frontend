import { ChevronLeft, ChevronRight } from '@carbon/icons-react'
import { Button } from '@carbon/react';
import { combine, createEvent, createStore, restore } from 'effector';
import { useStore } from 'effector-react';
import { useEffect } from 'react';

import { AboutType, Content } from '../about.type';
import {
  CaseStudiesOneCardsContainer,
  CaseStudiesOneWrapper,
  CaseStudyImageSection,
  CaseStudyInfoSection,
  CaseStudySliderSection,
  RightAndLeftWrapper,
  TestimonialSectionWrapper
} from "../styles/about-giga-map-styles"

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

function GigaMapEnbled({ data }: { data: Readonly<AboutType> }) {

  const { current, maxColumns, isNext, isPrev } = useStore($carousel);

  const handlePrev = () => {
    onChange(current - 1);
  };

  const handleNext = () => {
    onChange(current + 1);
  };

  useEffect(() => {
    if (data?.content) {
      updateTotalItems(data?.content.length);
    }
  }, [data]);

  return (
    <TestimonialSectionWrapper $style={data.style}>
      <div className="section-content">
        <RightAndLeftWrapper className="within-testimonial" $style={data.style}>
          <Button kind='ghost' className='left' renderIcon={ChevronLeft} onClick={handlePrev} disabled={!isPrev}></Button>
          <CaseStudiesOneWrapper>
            <CaseStudiesOneCardsContainer pos={current * 100}>
              {
                data?.content.map((singleSlide: Content, index: number) => (
                  <CaseStudySliderSection key={`${index}-${singleSlide?.title}`} column={maxColumns} $style={singleSlide.style}>
                    <CaseStudyImageSection>
                      <img src={singleSlide?.image} alt={singleSlide?.title || `Testimonial ${index + 1}`} />
                    </CaseStudyImageSection>
                    <CaseStudyInfoSection>
                      <div className="quote-icon">
                        <svg width="48" height="36" viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M0 36V20.4C0 9.12 4.32 0 12.96 0v7.2C8.16 7.2 5.76 11.28 5.76 17.28V20.4H21.6V36H0ZM26.4 36V20.4C26.4 9.12 30.72 0 39.36 0v7.2C34.56 7.2 32.16 11.28 32.16 17.28V20.4H48V36H26.4Z" fill="rgba(39, 122, 255, 0.2)" />
                        </svg>
                      </div>
                      <p className="testimonial-quote">
                        {singleSlide?.text?.[1]}
                      </p>
                      <div className="testimonial-author">
                        <h3>{singleSlide?.title}</h3>
                        <h5>{singleSlide?.text?.[0]}</h5>
                      </div>
                    </CaseStudyInfoSection>
                  </CaseStudySliderSection>
                ))
              }
            </CaseStudiesOneCardsContainer>
          </CaseStudiesOneWrapper>
          <Button kind='ghost' className='right' renderIcon={ChevronRight} onClick={handleNext} disabled={isNext}></Button>
        </RightAndLeftWrapper>
      </div>
    </TestimonialSectionWrapper>
  )
}

export default GigaMapEnbled