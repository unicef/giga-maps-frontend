import { CaseStudiesCard, CaseStudyInfoBox, CaseStudyPosterWrapper } from "../styles/about-giga-map-styles"


const CaseStudyCard = ({ cardPoster, title, description, column, style }:
  { cardPoster?: string, title?: string, description?: string; column: number; style?: string }) => {
  return (
    <CaseStudiesCard column={column} $style={style}>
      <div className="right-spacing">
        <CaseStudyPosterWrapper>
          <img src={cardPoster} />
        </CaseStudyPosterWrapper>
        <CaseStudyInfoBox>
          <h3>{title}</h3>
          <p>{description}</p>
        </CaseStudyInfoBox>
      </div>
    </CaseStudiesCard>
  )
}

export default CaseStudyCard