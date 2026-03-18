import { CaseStudiesCard, CaseStudyInfoBox, CaseStudyPosterWrapper } from "../styles/about-giga-map-styles"


const CaseStudyCard = ({ cardPoster, title, description, column, style, className }:
  { cardPoster?: string, title?: string, description?: string; column: number; style?: string; className?: string }) => {
  return (
    <CaseStudiesCard column={column} $style={style} className={`case-study-card ${className || ''}`}>
      <div className="case-study-container">
        <CaseStudyPosterWrapper className="case-study-poster-wrapper">
          <img src={cardPoster} />
        </CaseStudyPosterWrapper>
        <CaseStudyInfoBox className="case-study-info-box">
          <h3>{title}</h3>
          <p>{description}</p>
        </CaseStudyInfoBox>
      </div>
    </CaseStudiesCard>
  )
}

export default CaseStudyCard