import { useState, useEffect } from 'react';
import { Close } from '@carbon/icons-react';
import { AboutType, Content } from '../about.type';
import {
  CaseStudiesCompactSection,
  CaseStudiesSectionTitle,
  CompactPreviewGrid,
  CompactStoryCard,
  ShowAllStoriesButton,
  StoryModal,
  StoryModalContent,
  StoryModalHeader,
  StoryModalBody,
  CaseStudiesStats
} from "../styles/about-giga-map-styles";

interface CaseStudiesModalProps {
  data: AboutType;
  initialCardsToShow?: number;
}

const CaseStudiesModalSection = ({
  data,
  initialCardsToShow = 6
}: CaseStudiesModalProps) => {
  const [selectedStory, setSelectedStory] = useState<Content | null>(null);
  const [showAllCards, setShowAllCards] = useState(false);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedStory(null);
      }
    };

    if (selectedStory) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [selectedStory]);

  const displayedContent = showAllCards
    ? data?.content || []
    : (data?.content || []).slice(0, initialCardsToShow);

  const shouldShowMoreButton = (data?.content?.length || 0) > initialCardsToShow && !showAllCards;

  // Calculate stats for display
  const stats = {
    stories: data?.content?.length || 0,
    countries: Math.min(Math.ceil((data?.content?.length || 0) / 2), 12),
    impact: (data?.content?.length || 0) * 500
  };

  const handleCardClick = (story: Content) => {
    setSelectedStory(story);
  };

  const handleModalClose = () => {
    setSelectedStory(null);
  };

  const handleModalBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleModalClose();
    }
  };

  return (
    <>
      <CaseStudiesCompactSection>
        <CaseStudiesSectionTitle>
          <h2>{data?.title || 'Success Stories'}</h2>
          <p>{data?.text?.[0] || 'Discover how Giga is transforming education through connectivity worldwide'}</p>
        </CaseStudiesSectionTitle>



        <CompactPreviewGrid>
          {displayedContent.map((story, index) => (
            <CompactStoryCard
              key={`${index}-${story?.title}`}
              onClick={() => handleCardClick(story)}
            >
              <img
                src={story?.image}
                alt={story?.title || 'Story image'}
                className="story-image"
              />
              <div className="story-content">
                <h3 className="story-title">{story?.title}</h3>
                <p className="story-preview">
                  {story?.text?.[0]?.substring(0, 100)}...
                </p>
                <div className="story-cta">Read Full Story</div>
              </div>
            </CompactStoryCard>
          ))}
        </CompactPreviewGrid>

        {shouldShowMoreButton && (
          <ShowAllStoriesButton onClick={() => setShowAllCards(true)}>
            Show {(data?.content?.length || 0) - initialCardsToShow} More Stories
          </ShowAllStoriesButton>
        )}
      </CaseStudiesCompactSection>

      {/* Modal */}
      {selectedStory && (
        <StoryModal onClick={handleModalBackdropClick}>
          <StoryModalContent>
            <StoryModalHeader>
              <img
                src={selectedStory.image}
                alt={selectedStory.title || 'Story image'}
                className="modal-image"
              />
              <div className="modal-overlay" />
              <h1 className="modal-title">{selectedStory.title}</h1>
              <button
                className="modal-close"
                onClick={handleModalClose}
                aria-label="Close modal"
              >
                <Close size={20} />
              </button>
            </StoryModalHeader>

            <StoryModalBody>
              <div className="story-description">
                {selectedStory.text?.[0]}
              </div>

              {/* Additional details if available */}
              {selectedStory.text?.[1] && (
                <div className="story-details">
                  <div className="detail-item">
                    <div className="detail-label">Impact</div>
                    <div className="detail-value">High</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Region</div>
                    <div className="detail-value">Global</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Timeline</div>
                    <div className="detail-value">2023-2024</div>
                  </div>
                </div>
              )}

              {selectedStory.text?.[1] && (
                <div className="story-description">
                  {selectedStory.text[1]}
                </div>
              )}
            </StoryModalBody>
          </StoryModalContent>
        </StoryModal>
      )}
    </>
  );
};

export default CaseStudiesModalSection; 