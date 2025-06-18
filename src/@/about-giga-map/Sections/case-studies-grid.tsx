import { useState, useMemo } from 'react';
import { AboutType } from '../about.type';
import CaseStudyCard from "../common/case-study-card";
import {
  CaseStudiesFilterableSection,
  CaseStudiesSectionTitle,
  CaseStudiesFilters,
  CaseStudiesGrid,
  ShowMoreButton,
  CaseStudiesStats
} from "../styles/about-giga-map-styles";

interface CaseStudiesGridProps {
  data: AboutType;
  initialItemsToShow?: number;
  enableFilters?: boolean;
  featuredLayout?: boolean;
}

const CaseStudiesGridSection = ({
  data,
  initialItemsToShow = 6,
  enableFilters = true,
  featuredLayout = false
}: CaseStudiesGridProps) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [showAll, setShowAll] = useState(false);

  // Extract unique categories for filters (simplified - no categories in current type)
  const categories = useMemo(() => {
    return ['All']; // Simplified for now, can be extended when categories are added to Content type
  }, []);

  // Filter content based on active filter
  const filteredContent = useMemo(() => {
    if (!data?.content) return [];
    return data.content; // All content for now since no filtering properties exist
  }, [data?.content, activeFilter]);

  // Show limited or all items
  const displayedContent = showAll
    ? filteredContent
    : filteredContent.slice(0, initialItemsToShow);

  const shouldShowMoreButton = filteredContent.length > initialItemsToShow && !showAll;

  // Calculate stats for display
  const stats = useMemo(() => {
    if (!data?.content) return null;

    const totalStories = data.content.length;
    const estimatedCountries = Math.min(Math.ceil(totalStories / 2), 12); // Estimated based on content
    const estimatedImpact = totalStories * 500; // Estimated students per story

    return {
      stories: totalStories,
      countries: estimatedCountries,
      impact: estimatedImpact
    };
  }, [data?.content]);

  return (
    <CaseStudiesFilterableSection>
      <CaseStudiesSectionTitle>
        <h2>{data?.title || 'Success Stories'}</h2>
        <p>{data?.text?.[0] || 'Discover how Giga is transforming education through connectivity worldwide'}</p>
      </CaseStudiesSectionTitle>



      {enableFilters && categories.length > 1 && (
        <CaseStudiesFilters>
          {categories.map((category) => (
            <button
              key={category}
              className={`filter-button ${activeFilter === category ? 'active' : ''}`}
              onClick={() => {
                setActiveFilter(category);
                setShowAll(false); // Reset to initial view when filtering
              }}
            >
              {category}
            </button>
          ))}
        </CaseStudiesFilters>
      )}

      <CaseStudiesGrid className={featuredLayout ? 'featured-layout' : ''}>
        {displayedContent.map((item, index) => (
          <CaseStudyCard
            key={`${index}-${item?.title}`}
            column={1} // Not used in grid layout
            cardPoster={item?.image}
            title={item?.title}
            description={item?.text?.[0]}
          />
        ))}
      </CaseStudiesGrid>

      {shouldShowMoreButton && (
        <ShowMoreButton onClick={() => setShowAll(true)}>
          Show {filteredContent.length - initialItemsToShow} More Stories
        </ShowMoreButton>
      )}
    </CaseStudiesFilterableSection>
  );
};

export default CaseStudiesGridSection; 