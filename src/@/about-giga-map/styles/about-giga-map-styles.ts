import { ArrowDown } from '@carbon/icons-react'
import { Tab, TabList, TabPanel } from "@carbon/react";
import styled, { css } from "styled-components";

export const AboutGigaMapModalStyle = styled.div`
    background-color: #000000; 
    width: 100vw;
    max-height: calc()(100vh - 3rem);
`

export const AboutGigaMapNavBarStyle = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
padding: 1rem 0;
background: #000;
width: 100vw;
position: fixed;
top: 0;
z-index: 10;
min-height: 4rem;
box-sizing: border-box;

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 6rem;
}

.sidebar-menuIcon {
  margin-top: -0.45rem;
  svg {
  fill: #fff;
  }
}

@media (max-width: 968px) {
  .navbar-content {
    padding: 0 2rem;
  }
}

@media (max-width: 768px) {
  min-height: 3.5rem;
  
  .navbar-content {
    padding: 0 5%;
  }
}
`

export const AboutGigaMapBodyStyle = styled.div`
  color: #FFF;
  background-color: #000; 
  display: flex;
  padding-top: 6rem;
  padding-bottom: 4rem;
  flex-direction: column;
  overflow-y: unset;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;

  @media (max-width: 968px) {
    padding-top: 5.5rem;
    padding-bottom: 4rem;
  }

  @media (max-width: 768px) {
    padding-top: 5rem;
    padding-bottom: 4rem;
  }
`
export const ArrowDownIconWrapper = styled.div`
height:2rem;
width:2rem;
`

export const ArrowDownIcon = styled(ArrowDown)`
 fill :#277AFF;
`
export const TitleWrapper = styled.div`
width:60%;
margin-top:1rem;
`
export const Title = styled.p`
font-size: 1.25rem;
font-weight: 300;
`

export const Description = styled.p`
  font-size: 1.5rem;
  font-weight: 300;
  line-height: 1.6;
  margin-top:2rem;
`
export const MediaContainer = styled.div`
  height:37rem;
  width:100%;
  margin-top:3rem;
  background:white;

  img{
      width: 100%;
    height: 100%;
  }

  // @media (max-width: 576px) 
  // {
  //     img{
  //     object-fit: cover;
  //   }
  // }
`

export const FeaturesWrapper = styled.div`
 margin-top:4rem;
 h1{
font-size: 2.375rem;
font-weight: 300;
line-height: 1.2; 
margin:0;
 }
`
export const FeaturesTabsWrapper = styled.div`
margin-top:2rem;
`
export const FeatureTabList = styled(TabList)`

`
export const FeatureTab = styled(Tab)`
color:#fff !important;
:hover{
  color:#8d8d8d;
}
`
export const FeatureTabPanel = styled(TabPanel)`
padding : 0;
outline: none !important;
margin-top:4rem;
padding-bottom: 5.5rem;
border-bottom: 1px solid #595959;

`
export const FeatureCardContainer = styled.div<{ $style?: string }>`
    padding: 4rem 0;
    background: linear-gradient(135deg, rgba(39, 122, 255, 0.02) 0%, rgba(0, 0, 0, 0.05) 100%);
    position: relative;
    
    .section-content {
      padding: 0 6rem;
    }
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent 0%, rgba(39, 122, 255, 0.3) 50%, transparent 100%);
    }
    
    .resource-wrapper {
      display: flex;
      flex-wrap: wrap;
    }
    
    ${props => props.$style && css`${props.$style}`}
    
    @media (max-width: 768px) {
      padding: 3rem 0;
      
      .section-content {
        padding: 0 5%;
      }
    }
`

export const ResourcesSectionTitle = styled.div`
text-align: left;
margin-bottom: 3rem;
position: relative;

h2 {
  font-size: 3rem;
  font-weight: 300;
  color: #fff;
  margin-bottom: 1rem;
  position: relative;
}

p {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 300;
  line-height: 1.6;
  max-width: 600px;
  margin: 0;
}

&::after {
  content: '';
  position: absolute;
  bottom: -1rem;
  left: 0;
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #277AFF 0%, #4F46E5 100%);
  border-radius: 2px;
}

@media (max-width: 768px) {
  margin-bottom: 2rem;
  
  h2 {
    font-size: 2.5rem;
  }
  
  p {
    font-size: 1.125rem;
    padding: 0 1rem;
  }
}
`

export const ResourcesGrid = styled.div`
display: grid;
grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
gap: 1.5rem;
max-width: 1200px;
margin-left: auto;
margin-right: auto;

@media (max-width: 768px) {
  grid-template-columns: 1fr;
  gap: 1rem;
    }
`

export const FeatureCardWrapper = styled.a<{ $style?: string }>`
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(39, 122, 255, 0.01) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  text-decoration: none;
  backdrop-filter: blur(20px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  min-height: 200px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #277AFF 0%, #4F46E5 100%);
    transform: scaleX(0);
    transition: transform 0.4s ease;
  }

  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(39, 122, 255, 0.03) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
  }

  &:hover {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(39, 122, 255, 0.03) 100%);
    border-color: rgba(39, 122, 255, 0.4);
    transform: translateY(-6px) scale(1.01);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), 0 0 30px rgba(39, 122, 255, 0.1);
    
    &::before {
      transform: scaleX(1);
  }

    &::after {
      opacity: 1;
    }
    
    .card-icon {
      transform: scale(1.05) rotate(3deg);
      filter: drop-shadow(0 6px 12px rgba(39, 122, 255, 0.2));
    }
    
    .hover-button {
      opacity: 1;
      transform: translateY(0);
    }
    
    h3 {
      transform: translateY(-1px);
    }
  }

  .card-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  .card-icon {
    width: 44px;
    height: 44px;
    background: rgba(39, 122, 255, 0.1);
    border: 2px solid rgba(39, 122, 255, 0.2);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(10px);
    
    > div {
      color: #277AFF;
      filter: brightness(1.2);
    }
  }

  h3{
    color: #fff;
    font-size: 1.25rem;
    font-weight: 500;
    line-height: 1.3;
    margin-bottom: 0.75rem;
    transition: all 0.3s ease;
    letter-spacing: -0.01em;
  }

  p{
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: auto;
    font-size: 0.95rem;
    font-weight: 400;
    line-height: 1.5;
    flex-grow: 1;
    opacity: 0.9;
  }

  .hover-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 1rem;
    padding: 0.65rem 1rem;
    background: linear-gradient(135deg, #277AFF 0%, #4F46E5 100%);
    border: none;
    border-radius: 10px;
    color: #fff;
    font-size: 0.8rem;
    font-weight: 600;
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(10px);
    box-shadow: 0 3px 10px rgba(39, 122, 255, 0.3);
    
    span {
      font-size: 0.875rem;
      font-weight: 600;
    }
    
    svg {
      fill: #fff;
      transition: transform 0.2s ease;
    }
    
    &:hover {
      svg {
        transform: translateX(2px);
      }
    }
  }

  .card-accent {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 4px;
    height: 4px;
    background: #277AFF;
    border-radius: 50%;
    opacity: 0.6;
  }
  
  @media (max-width: 768px) {
    padding: 1.25rem;
    min-height: 180px;
    
    .card-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
    }
    
      h3{
        font-size: 1.125rem;
      margin-bottom: 0.5rem;
      }
    
      p{
      font-size: 0.875rem;
      line-height: 1.4;
    }
    
    .hover-button {
      margin-top: 1.25rem;
      padding: 0.625rem 1rem;
      
      span {
        font-size: 0.8125rem;
      }
  }
  }
  
  ${props => props.$style && css`${props.$style}`}
`

export const CaseStudiesWrapper = styled.div`
    overflow:hidden;
    h1{
    font-size: 3rem;
    font-weight: 300;
    line-height: 1.2;
    margin: 0;
    }

`
export const CaseStudiesOneWrapper = styled.div`
    margin-top: 2rem;
    padding-bottom: 2rem;
    overflow: hidden;
    max-width: 1200px;
    position: relative;
    
    h1{
    font-size: 3rem;
    font-weight: 300;
    line-height: 1.2;
    margin: 0;
    }
`
export const SliderWrapper = styled.div<{ $style?: string }>`
  .section-content {
    padding: 0 6rem;
    
    @media (max-width: 768px) {
      padding: 0 5%;
    }
  }
  
  ${props => props.$style ?? css`${props.$style}`}
`
export const RightAndLeftWrapper = styled.div<{ $style?: string }>`
display: flex;
align-items: center;
justify-content: center;
padding: 2rem 0;
position: relative;

// When used standalone (not within TestimonialSectionWrapper)
&:not(.within-testimonial) {
  padding: 4rem 6rem;
  min-height: 100vh;
  background: linear-gradient(135deg, rgba(39, 122, 255, 0.03) 0%, rgba(0, 0, 0, 0.05) 100%);
   
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, rgba(39, 122, 255, 0.3) 50%, transparent 100%);
  }
}
   
.left{
  position: absolute;
  left: 2rem;
  z-index: 3;
  background: rgba(39, 122, 255, 0.1);
  border: 1px solid rgba(39, 122, 255, 0.2);
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(39, 122, 255, 0.2);
    transform: scale(1.1);
    box-shadow: 0 8px 25px rgba(39, 122, 255, 0.3);
  }
  
  &:disabled {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
    opacity: 0.5;
    
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
  
  svg{
    height: 20px;
    width: 20px;
    fill: #fff;
      }
}

.right{
position: absolute;
  right: 2rem;
  z-index: 3;
  background: rgba(39, 122, 255, 0.1);
  border: 1px solid rgba(39, 122, 255, 0.2);
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(39, 122, 255, 0.2);
    transform: scale(1.1);
    box-shadow: 0 8px 25px rgba(39, 122, 255, 0.3);
  }
  
  &:disabled {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
    opacity: 0.5;
    
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
  
  svg{
    height: 20px;
    width: 20px;
    fill: #fff;
      }
    }

    ${props => props.$style ?? css`${props.$style}`}

    @media (max-width: 768px) {
      &:not(.within-testimonial) {
        padding: 2rem 1rem;
      }
  
      .left{
        left: 1rem;
        width: 40px;
        height: 40px;
        
        svg{
          height: 16px;
          width: 16px;
        }
      }
  
      .right {
        right: 1rem;
        width: 40px;
        height: 40px;
        
        svg{
          height: 16px;
          width: 16px;
        }
      }
    }
`
export const CaseStudiesCardsContainer = styled.div<{ pos: number }>`
  display: flex;
  /* flex-wrap: wrap; */
  justify-content: space-between;
  margin-top:2rem;
  transition: all 1s;
  transform: translateX(-${props => props.pos ?? 0}%);
  width: 100%;
  box-sizing: border-box;
  

`
export const CaseStudiesOneCardsContainer = styled.div<{ pos: number }>`
  display: flex;
  margin-top: 2rem;
  transition: all 1s;
  transform: translateX(-${props => props.pos ?? 0}%);
  width: 100%;
  box-sizing: border-box;
  gap: 2rem;
  padding: 0 1rem;
  
  @media(max-width: 1024px){
    gap: 1rem;
    padding: 0 0.5rem;
  }

  @media(max-width: 768px){
    gap: 0.5rem;
    padding: 0 0.25rem;
  }
`
export const CaseStudiesSectionTitle = styled.div`
text-align: left;
margin-bottom: 4rem;
position: relative;

h2 {
  font-size: 3.5rem;
  font-weight: 300;
  line-height: 1.2;
  color: #fff;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
}

p {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.8);
  max-width: 600px;
  margin: 0;
  line-height: 1.6;
  font-weight: 300;
}

&::after {
  content: '';
  position: absolute;
  bottom: -2rem;
  left: 0;
  width: 120px;
  height: 4px;
  background: linear-gradient(90deg, rgba(39, 122, 255, 0.8) 0%, transparent 100%);
  border-radius: 2px;
}

@media (max-width: 1024px) {
  margin-bottom: 3rem;
  
  h2 {
    font-size: 3rem;
  }
  
  p {
    font-size: 1.125rem;
  }
}

@media (max-width: 768px) {
  margin-bottom: 2.5rem;
  
  h2 {
    font-size: 2.5rem;
    line-height: 1.2;
  }
  
  p {
    font-size: 1rem;
    line-height: 1.5;
  }
  
  &::after {
    bottom: -1.5rem;
    width: 80px;
    height: 3px;
  }
}
`

export const CaseStudiesFilterableSection = styled.div`
padding: 4rem 6rem;

@media (max-width: 768px) {
  padding: 2rem 5%;
}
`

export const CaseStudiesFilters = styled.div`
display: flex;
justify-content: center;
gap: 1rem;
margin-bottom: 3rem;
flex-wrap: wrap;

.filter-button {
  padding: 0.75rem 1.5rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.8);
  border-radius: 25px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    border-color: rgba(39, 122, 255, 0.5);
    background: rgba(39, 122, 255, 0.1);
    color: #fff;
    transform: translateY(-2px);
  }
  
  &.active {
    border-color: #277AFF;
    background: linear-gradient(135deg, #277AFF 0%, #4F46E5 100%);
    color: #fff;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(39, 122, 255, 0.3);
  }
}

@media (max-width: 768px) {
  gap: 0.5rem;
  margin-bottom: 2rem;
  
  .filter-button {
    padding: 0.5rem 1rem;
    font-size: 0.75rem;
  }
}
`

export const CaseStudiesGrid = styled.div`
display: grid;
grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
gap: 2rem;
margin-bottom: 3rem;

&.featured-layout {
  grid-template-columns: 2fr 1fr 1fr;
  
  .case-study-card:first-child {
    grid-row: span 2;
    
    .case-study-container {
      height: 100%;
    }
    
    .case-study-poster-wrapper {
      height: 24rem;
    }
    
    .case-study-info-box {
      padding: 3rem 2rem;
      
      h3 {
        font-size: 2.25rem;
        margin-bottom: 2rem;
      }
      
      p {
        font-size: 1.25rem;
        line-height: 1.8;
      }
    }
  }
}

@media (max-width: 1200px) {
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  
  &.featured-layout {
    grid-template-columns: 1fr 1fr;
    
    .case-study-card:first-child {
      grid-column: span 2;
      grid-row: span 1;
      
      .case-study-poster-wrapper {
        height: 20rem;
      }
      
      .case-study-info-box {
        padding: 2.5rem 2rem;
        
        h3 {
          font-size: 2rem;
        }
        
        p {
          font-size: 1.125rem;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  &.featured-layout {
    grid-template-columns: 1fr;
    
    .case-study-card:first-child {
      grid-column: span 1;
      grid-row: span 1;
      
      .case-study-poster-wrapper {
        height: 18rem;
      }
      
      .case-study-info-box {
        padding: 2rem 1.5rem;
        
        h3 {
          font-size: 1.75rem;
        }
        
        p {
          font-size: 1rem;
        }
      }
    }
  }
}
`

export const ShowMoreButton = styled.button`
display: block;
margin: 2rem auto 0;
padding: 1rem 2.5rem;
background: linear-gradient(135deg, #277AFF 0%, #4F46E5 100%);
border: none;
border-radius: 50px;
color: #fff;
font-size: 1rem;
font-weight: 600;
cursor: pointer;
transition: all 0.3s ease;
position: relative;
overflow: hidden;

&::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%);
  transition: left 0.5s ease;
}

&:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(39, 122, 255, 0.4);
  
  &::before {
    left: 100%;
  }
}

&:active {
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  padding: 0.875rem 2rem;
  font-size: 0.875rem;
}
`

export const CaseStudiesStats = styled.div`
display: flex;
justify-content: center;
gap: 3rem;
margin-bottom: 3rem;
padding: 2rem;
background: rgba(255, 255, 255, 0.02);
border-radius: 20px;
border: 1px solid rgba(255, 255, 255, 0.05);
backdrop-filter: blur(10px);

.stat-item {
  text-align: center;
  
  .stat-label {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.9);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 600;
    background: linear-gradient(135deg, #277AFF 0%, #4F46E5 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}

@media (max-width: 768px) {
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  
  .stat-item {
    .stat-label {
      font-size: 0.875rem;
    }
  }
}
`

export const CaseStudiesCompactSection = styled.div`
padding: 4rem 6rem;

@media (max-width: 768px) {
  padding: 2rem 5%;
}
`

export const CompactPreviewGrid = styled.div`
display: flex;
flex-wrap: wrap;
gap: 1.5rem;
margin-bottom: 2rem;

& > * {
  flex: 1 1 280px;
  min-width: 280px;
}

@media (max-width: 768px) {
  gap: 1rem;
  
  & > * {
    flex: 1 1 250px;
    min-width: 250px;
  }
}
`

export const CompactStoryCard = styled.div`
background: rgba(255, 255, 255, 0.03);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 16px;
overflow: hidden;
cursor: pointer;
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
position: relative;
height: 260px;

&:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
  border-color: rgba(39, 122, 255, 0.4);
}

.story-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

&:hover .story-image {
  transform: scale(1.05);
}

.story-content {
  padding: 1.25rem;
  height: 140px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.story-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 0.5rem;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.story-preview {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.story-cta {
  margin-top: auto;
  padding-top: 0.75rem;
  font-size: 0.75rem;
  color: #277AFF;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

&::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent 0%, rgba(39, 122, 255, 0.8) 50%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

&:hover::after {
  opacity: 1;
}

@media (max-width: 768px) {
  height: 240px;
  
  .story-image {
    height: 110px;
  }
  
  .story-content {
    padding: 1rem;
    height: 130px;
  }
  
  .story-title {
    font-size: 1rem;
  }
  
  .story-preview {
    font-size: 0.8rem;
  }
}
`

export const ShowAllStoriesButton = styled.button`
display: block;
margin: 2rem auto 0;
padding: 1rem 2rem;
background: transparent;
border: 2px solid rgba(39, 122, 255, 0.5);
border-radius: 50px;
color: #277AFF;
font-size: 0.875rem;
font-weight: 600;
cursor: pointer;
transition: all 0.3s ease;
text-transform: uppercase;
letter-spacing: 0.05em;

&:hover {
  background: rgba(39, 122, 255, 0.1);
  border-color: #277AFF;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(39, 122, 255, 0.2);
}

@media (max-width: 768px) {
  padding: 0.875rem 1.5rem;
  font-size: 0.75rem;
}
`

export const StoryModal = styled.div`
position: fixed;
top: 0;
left: 0;
right: 0;
bottom: 0;
z-index: 9999;
display: flex;
align-items: center;
justify-content: center;
padding: 2rem;
background: rgba(0, 0, 0, 0.8);
backdrop-filter: blur(10px);

@media (max-width: 768px) {
  padding: 1rem;
  align-items: flex-start;
  padding-top: 2rem;
}
`

export const StoryModalContent = styled.div`
background: linear-gradient(135deg, rgba(34, 34, 34, 0.95) 0%, rgba(16, 16, 16, 0.98) 100%);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 24px;
max-width: 800px;
width: 100%;
max-height: 90vh;
overflow-y: auto;
position: relative;
backdrop-filter: blur(20px);
box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6);

&::-webkit-scrollbar {
  width: 6px;
}

&::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

&::-webkit-scrollbar-thumb {
  background: rgba(39, 122, 255, 0.3);
  border-radius: 3px;
}

@media (max-width: 768px) {
  border-radius: 16px;
  max-height: 85vh;
}
`

export const StoryModalHeader = styled.div`
position: relative;
height: 300px;
overflow: hidden;
border-radius: 24px 24px 0 0;

.modal-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-close {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(39, 122, 255, 0.8);
    transform: scale(1.1);
  }
}

.modal-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
}

.modal-title {
  position: absolute;
  bottom: 2rem;
  left: 2rem;
  right: 2rem;
  font-size: 2.25rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
  line-height: 1.2;
}

@media (max-width: 768px) {
  height: 200px;
  border-radius: 16px 16px 0 0;
  
  .modal-title {
    font-size: 1.75rem;
    bottom: 1.5rem;
    left: 1.5rem;
    right: 1.5rem;
  }
  
  .modal-close {
    top: 1rem;
    right: 1rem;
    width: 36px;
    height: 36px;
  }
}
`

export const StoryModalBody = styled.div`
padding: 2.5rem;

.story-description {
  font-size: 1.125rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.story-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.detail-item {
  background: rgba(255, 255, 255, 0.02);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  
  .detail-label {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.6);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  
  .detail-value {
    font-size: 1.25rem;
    font-weight: 600;
    color: #277AFF;
  }
}

@media (max-width: 768px) {
  padding: 2rem 1.5rem;
  
  .story-description {
    font-size: 1rem;
    line-height: 1.6;
  }
  
  .story-details {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .detail-item {
    padding: 1.25rem;
    
    .detail-value {
      font-size: 1.125rem;
    }
  }
}
`

export const CaseStudiesCard = styled.div<{ column?: number, $style?: string }>`
  flex: 1 1 0;
  padding: 0 1.5rem;
  min-width: calc((100% / ${props => props.column ?? 1}) - 3rem);
  max-width: calc((100% / ${props => props.column ?? 1}) - 3rem);
  position: relative;
  box-sizing: border-box;
  
  &:hover .case-study-container {
    transform: translateY(-12px);
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
    border-color: rgba(39, 122, 255, 0.4);
  }
  
  .case-study-container {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(39, 122, 255, 0.02) 100%);
    border-radius: 20px;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border: 2px solid rgba(255, 255, 255, 0.1);
    position: relative;
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(39, 122, 255, 0.08) 0%, rgba(79, 70, 229, 0.04) 100%);
      opacity: 0;
      transition: opacity 0.4s ease;
      z-index: -1;
    }
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, transparent 0%, rgba(39, 122, 255, 0.8) 50%, transparent 100%);
      opacity: 0;
      transition: opacity 0.4s ease;
    }
    
    &:hover::before {
      opacity: 1;
    }
    
    &:hover::after {
      opacity: 1;
    }
  }
  
  .right-spacing {
     flex: 1 1 0;
    margin-right: 1px;
  }
  
  @media (max-width: 1024px) {
    padding: 0 1rem;
    margin-bottom: 3rem;
  }
  
  @media (max-width: 768px) {
    padding: 0 0.75rem;
    margin-bottom: 2rem;
    
    .case-study-container {
      border-radius: 16px;
    }
    
    &:hover .case-study-container {
      transform: translateY(-6px);
    }
  }
  
  ${props => props.$style ?? css`${props.$style}`}
`
export const CaseStudyPosterWrapper = styled.div`
     width: 100%; 
height: 20rem;
position: relative;
overflow: hidden;
border-radius: 20px 20px 0 0;

&::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(39, 122, 255, 0.15) 0%, rgba(79, 70, 229, 0.08) 100%);
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 1;
}

&:hover::before {
  opacity: 1;
}

img {
  height: 100%;
  width: 100%;
  border-radius: 20px 20px 0 0;
  object-fit: cover;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

&:hover img {
  transform: scale(1.08);
}

@media (max-width: 768px) {
  height: 16rem;
  border-radius: 16px 16px 0 0;
  
  img {
    border-radius: 16px 16px 0 0;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
}
`
export const CaseStudyInfoBox = styled.div`
height: max-content;
width: 100%;
padding: 2.5rem 2rem;
background: linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(39, 122, 255, 0.02) 100%);
border-radius: 0 0 20px 20px;
backdrop-filter: blur(15px);
position: relative;

h3{
  margin-top: 0;
  font-size: 1.875rem;
  font-weight: 300;
  line-height: 1.3;
  color: #fff;
  margin-bottom: 1.5rem;
}

p {
  margin-top: 0;
  font-size: 1.125rem;
  font-weight: 300;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px){
  padding: 2rem 1.5rem;
  border-radius: 0 0 16px 16px;
  
  h3{
    font-size: 1.5rem;
    line-height: 1.3;
    margin-bottom: 1rem;
  }
  
  p{
    font-size: 1rem;
    line-height: 1.6;
  }
}
`

export const PaginationContainer = styled.div`
  margin-top:1rem;
  display:flex;
  align-items:center;
  justify-content:end;

  .cds--pagination-nav__page {
    color: #fff !important;

    option{
      color: black !important;
    }
  }
  
  .cds--btn--icon-only.cds--btn.cds--btn--ghost{
    background: #fff;

    svg{
      fill:black;
    }
  }

  .cds--btn--icon-only.cds--btn.cds--btn--ghost.cds--btn--disabled {
    background: #7E7E7E important;
    svg{
      fill:#C8C8C8 !important;
    }
  }
`

export const PartnersWrapper = styled.div<{ $style?: string }>`
padding: 4rem 0;
min-height: 100vh;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
background: linear-gradient(135deg, rgba(39, 122, 255, 0.02) 0%, rgba(79, 70, 229, 0.02) 100%);
position: relative;

.section-content {
  padding: 0 6rem;
  width: 100%;
}



@media (max-width: 768px) {
  padding: 3rem 0;
  min-height: 80vh;
  
  .section-content {
    padding: 0 5%;
  }
}

${props => props.$style ?? css`${props.$style}`}
`

export const PartnersSectionTitle = styled.div`
text-align: left;
margin-bottom: 4rem;

h2 {
  font-size: 3.5rem;
  font-weight: 300;
  margin: 0 0 1rem 0;
  color: #fff;
  line-height: 1.2;
  position: relative;
}

h2::after {
  content: '';
  position: absolute;
  bottom: -0.5rem;
  left: 0;
  width: 80px;
  height: 2px;
  background: linear-gradient(90deg, #277AFF 0%, #4F46E5 100%);
  border-radius: 2px;
}

p {
  font-size: 1.125rem;
  color: #C8C8C8;
  margin: 0;
  line-height: 1.6;
  font-weight: 400;
}

@media (max-width: 768px) {
  margin-bottom: 3rem;
  
  h2 {
    font-size: 2.5rem;
  }
  
  p {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  h2 {
    font-size: 2rem;
  }
  
  p {
    font-size: 0.9rem;
  }
}
`

export const FeaturedPartnersGrid = styled.div`
display: grid;
grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
gap: 2rem;
max-width: 1200px;
width: 100%;
margin-bottom: 4rem;

@media (max-width: 1200px) {
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

@media (max-width: 768px) {
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 3rem;
}

@media (max-width: 480px) {
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
}
`

export const FeaturedPartnerCard = styled.div`
position: relative;
height: 200px;
border-radius: 20px;
background: rgba(255, 255, 255, 0.03);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.1);
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
overflow: hidden;

&::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #277AFF 0%, #4F46E5 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.partner-logo-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  
  img {
    max-width: 100%;
    max-height: 100px;
    object-fit: contain;
    filter: grayscale(0%) brightness(1);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

&:hover {
  transform: translateY(-6px);
  box-shadow: 0 25px 50px rgba(39, 122, 255, 0.15);
  border-color: rgba(39, 122, 255, 0.2);
  
  &::before {
    opacity: 1;
  }
  
  .partner-logo-container img {
    transform: scale(1.05);
    filter: brightness(1.1);
  }
}

@media (max-width: 768px) {
  height: 160px;
  border-radius: 16px;
  
  .partner-logo-container {
    padding: 2rem;
    
    img {
      max-height: 80px;
    }
  }
}

@media (max-width: 480px) {
  height: 140px;
  
  .partner-logo-container {
    padding: 1.5rem;
    
    img {
      max-height: 70px;
    }
  }
}
`

export const SectionDivider = styled.div`
display: flex;
align-items: center;
width: 100%;
max-width: 1200px;
margin: 4rem 0;
position: relative;

.divider-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(39, 122, 255, 0.3) 50%, transparent 100%);
}

.divider-content {
  margin: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  padding: 0 1.5rem;
  border-radius: 25px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  h3 {
    font-size: 1.25rem;
    font-weight: 300;
    color: #E0E0E0;
    margin: 0;
    white-space: nowrap;
  }
}

@media (max-width: 768px) {
  margin: 3rem 0;
  
  .divider-content {
    margin: 0 1rem;
    padding: 0 1rem;
    
    h3 {
      font-size: 1.125rem;
    }
  }
}

@media (max-width: 480px) {
  .divider-content {
    margin: 0 0.5rem;
    padding: 0 0.75rem;
    
    h3 {
      font-size: 1rem;
    }
  }
}
`

export const AcknowledgementsSection = styled.div`
width: 100%;
max-width: 1200px;
margin-top: 1rem;

@media (max-width: 768px) {
  margin-top: 0.75rem;
}

@media (max-width: 480px) {
  margin-top: 0.5rem;
}
`

export const AcknowledgementsGrid = styled.div`
display: grid;
grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
gap: 1rem;
width: 100%;

@media (max-width: 768px) {
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.75rem;
}

@media (max-width: 480px) {
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}
`

export const AcknowledgementCard = styled.div`
height: 80px;
border-radius: 10px;
background: rgba(255, 255, 255, 0.015);
backdrop-filter: blur(8px);
border: 1px solid rgba(255, 255, 255, 0.03);
display: flex;
align-items: center;
justify-content: center;
padding: 0.75rem;
transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
position: relative;
overflow: hidden;

&::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(79, 70, 229, 0.2) 50%, transparent 100%);
  opacity: 0;
  transition: opacity 0.2s ease;
}

img {
  max-width: 100%;
  max-height: 40px;
  object-fit: contain;
  filter: grayscale(80%) brightness(0.7) contrast(1.1);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

&:hover {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.025);
  border-color: rgba(79, 70, 229, 0.1);
  
  &::before {
    opacity: 1;
  }
  
  img {
    filter: grayscale(40%) brightness(0.85) contrast(1.1);
    transform: scale(1.02);
  }
}

@media (max-width: 768px) {
  height: 70px;
  border-radius: 8px;
  padding: 0.5rem;
  
  img {
    max-height: 35px;
  }
}

@media (max-width: 480px) {
  height: 60px;
  border-radius: 6px;
  padding: 0.4rem;
  
  img {
    max-height: 30px;
  }
}
`

export const CompactPartnersGrid = styled.div`
display: grid;
grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
gap: 1.5rem;
width: 100%;
max-width: 1200px;

@media (max-width: 768px) {
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
}

@media (max-width: 480px) {
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}
`

export const CompactPartnerCard = styled.div`
height: 100px;
border-radius: 12px;
background: rgba(255, 255, 255, 0.02);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.05);
display: flex;
align-items: center;
justify-content: center;
padding: 1rem;
transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

img {
  max-width: 100%;
  max-height: 50px;
  object-fit: contain;
  filter: grayscale(70%) brightness(0.9);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

&:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(39, 122, 255, 0.15);
  
  img {
    filter: grayscale(0%) brightness(1);
    transform: scale(1.02);
  }
}

@media (max-width: 768px) {
  height: 80px;
  border-radius: 10px;
  padding: 0.75rem;
  
  img {
    max-height: 40px;
  }
}

@media (max-width: 480px) {
  height: 70px;
  border-radius: 8px;
  padding: 0.5rem;
  
  img {
    max-height: 35px;
  }
}
`

export const PartnersCardContainer = styled.div`
display: flex;
flex-wrap: wrap;
    align-items: center;
    justify-content: center;

    .single-item-wrapper{
      height: 10rem;
      width: 14rem;
      display: flex;
      align-items: center;
      justify-content: center;
      img{
        margin-top:1.5rem;
        margin-right:1rem;
      }
    }

@media (max-width: 768px){
  .single-item-wrapper{
    width: auto;
    height: auto;
    padding-top: 1.5rem;
    img {
      margin-top: 0;
    }
  }
}

`
export const SingleItemWrapper = styled.div<{ $style?: string }>`
  ${props => props.$style ?? css`${props.$style}`}
`
export const NavBarGigaLogo = styled.div<{ $size?: string }>`
display: flex;
align-items: center;
margin-right: 2rem;
block-size: ${props => props.$size ?? 'auto'};

img, svg {
  // image contain size
  block-size: ${props => props.$size ?? 'auto'};
  object-fit: contain;
  max-height: 2.5rem;
  transition: transform 0.2s ease;
}

&:hover img, &:hover svg {
  transform: scale(1.05);
}

@media(max-width: 1200px){
  margin-right: 1.5rem;
  
  img, svg {
    max-height: 2.25rem;
  }
}

@media(max-width: 968px){
  margin-right: 1rem;
  
  img, svg {
    max-height: 2rem;
  }
}

@media(max-width: 768px){
  margin-right: 0.5rem;
  
  img {
    display: none;
  }
  
  svg {
    max-height: 1.75rem;
  }
}
`

export const NavBarButtonWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-left: auto;
    
    button{
      margin-left: 2rem;
      white-space: nowrap;
    }
    
    @media(max-width: 1200px){
      button {
        margin-left: 1.5rem;
    }
    }
    
    @media(max-width: 968px){
      button {
        margin-left: 1rem;
      }
    }

    @media(max-width: 768px){
      gap: 0.25rem;
      button {
        margin-left: 0.5rem;
        font-size: 0.875rem;
      }
    }
`
export const NavBarButton = styled.div<{ $active: boolean }>`
margin-right: 1.25rem;
padding: 0.5rem 0;

a {
font-size: 14px;
font-weight: 500;
color: ${props => props.$active ? '#277AFF' : '#fff'};
  text-decoration: none;
  white-space: nowrap;
  transition: color 0.2s ease;
}

a:hover{
  color: #277AFF;
}

@media(max-width: 1200px){
  margin-right: 1rem;
}

@media(max-width: 968px){
  margin-right: 0.75rem;
  
  a {
    font-size: 13px;
  }
}

@media(max-width: 768px){
  margin-right: 0.5rem;
  padding: 0.25rem 0;
  
  a {
    font-size: 12px;
  }
}
`
export const AboutSection = styled.div<{ $style?: string }>`
display:flex;
align-items:center;
justify-content: space-between;
width: 100%;
min-height:100vh;
position: relative;
padding: 2rem 0;

.section-content {
  padding: 0 6rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4rem;
  transform: translateY(-3rem);
}

@media(max-width: 768px){
  padding: 1rem 0;
  min-height: 70vh;
  
  .section-content {
    padding: 0 5%;
    flex-direction: column;
    gap: 2rem;
    transform: translateY(-1rem);
  }
}
  ${props => props.$style ?? css`${props.$style}`}
`
export const AboutInfoSection = styled.div`
width: 42%;
position: relative;
z-index: 1;

.heading {
  color: #fff;
  font-size: 3.75rem;
  font-weight: 300;
  max-width: 34rem;
  line-height: 1.1;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
  
  &::after {
    content: '';
    display: block;
    width: 120px;
    height: 4px;
    background: linear-gradient(90deg, #277AFF 0%, #4F46E5 100%);
    margin-top: 1.5rem;
    border-radius: 2px;
  }
}

.marginLeft{
  margin-left:1rem;
}

.blue {
  color:#277AFF;
}

.about-info-section-wrapper{
  display: inline-block;
}

p{
  margin-top: 2rem;
  color: rgba(255, 255, 255, 0.9);
  font-size: 18px;
  font-weight: 300;
  line-height: 1.6;
  max-width: 28rem;
  
  &::before {
    content: '';
    display: inline-block;
    width: 6px;
    height: 6px;
    background: #277AFF;
    border-radius: 50%;
    margin-right: 12px;
    vertical-align: middle;
  }
}

button{
  margin-top: 3.5rem;
  transform: scale(1.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.15);
    box-shadow: 0 8px 25px rgba(39, 122, 255, 0.3);
  }
}

.stats-preview {
  margin-top: 3rem;
  display: flex;
  gap: 1.5rem;
  flex-wrap: nowrap;
  justify-content: flex-start;
}

.stat-item {
  display: flex;
  flex-direction: column;
  flex: 0 1 auto;
  min-width: 120px;
  white-space: nowrap;
  
  .stat-number {
    color: #277AFF;
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  
  .stat-label {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.4;
  }
}

@media(max-width: 1200px){
  .heading {
    font-size: 3.25rem;
  }
}

@media(max-width: 968px){
  .heading {
    font-size: 3rem;
  }
}

@media(max-width: 768px){
  width: 70%;
  
  .heading {
    font-size: 3rem;
    max-width: 100%;
  }
  
  p {
    font-size: 16px;
    max-width: 100%;
  }
  
  button{
    transform: scale(1);
    margin-top: 2.5rem;
    
    &:hover {
      transform: scale(1.05);
    }
  }
  
  .stats-preview {
    margin-top: 2rem;
    gap: 1rem;
    flex-wrap: wrap;
  }
}

@media(max-width: 480px){
  .heading {
    font-size: 2.5rem;
  }
  
  .stats-preview {
    flex-direction: column;
    gap: 1rem;
  }
}
`

export const AboutImageSection = styled.div`
width: 58%;
position: relative;
display: flex;
align-items: center;
justify-content: center;
img{
  width:  100%;
  height:  740px;
  object-fit: contain;
  object-position: right;
}
@media(max-width: 768px){
  width:100%;
  margin-top: 2rem;
}
`

export const InteractiveGlobeWrapper = styled.div`
width: 100%;
height: 740px;
position: relative;
display: flex;
align-items: center;
justify-content: center;

@media(max-width: 768px){
  height: 400px;
}

@media(max-width: 480px){
  height: 300px;
}
`

export const ImpactSection = styled.div<{ $style?: string }>`
padding-left:6rem;
padding-right:1rem;
min-height: 80vh;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
padding-top: 3rem;
padding-bottom: 3rem;
@media (max-width: 768px){
  padding: 2rem 8%;
  min-height: 60vh;
}
${props => props.$style ?? css`${props.$style}`}
`

export const ImpactSectionKnowMore = styled.div`
display:flex;
align-items:center;
justify-content:center;
flex-wrap: wrap;
p{
  color:#fff;
  font-size: 16px;
  font-weight: 300;
  line-height: 1.5;
}
@media (max-width: 768px){
  padding-bottom: .5rem;
  p{
    text-align: center;
    font-size: 1rem;
    line-height: 1.5rem;
  }
}
`

export const ConnectivityNumberWrapper = styled.div`
    display:flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 100%;
    @media(max-width: 768px){ 
      margin-left: 32px;
      margin-right: 32px;
      flex-direction: column;
      align-items: center;
    }
`

export const NumberContainer = styled.div<{ $style?: string }>`
display:flex;
align-items:center;
color:#fff;
padding: 2.5rem 2rem 0rem 0rem;
width: 33.33%;
justify-content: center;
min-width: 17.5rem;

h1{
  font-size: 76px;
  font-weight: 300;
  line-height: 1.1;
  margin:0;
  }

p{
  margin-top: 0.75rem;
  font-size: 1rem;
  font-weight: 300;
  line-height: 1.5;
}
svg{
  margin-right:0.5rem;
  width:56px;
  height:56px;
}
@media(max-width: 768px){
  justify-content: flex-start;
  padding: 1.6rem 0rem 0rem 0rem;
  h1 {
    font-size: 72px;
    line-height: 70px;
    padding-bottom: .5rem;
  }
  p{
    font-size: 16px;
    line-height: 24px;
    margin-top: 0;
  }
}

${props => props.$style ?? css`${props.$style}`}
`

export const BarChartWrapper = styled.div`
margin-top:1rem;
width:100%;
`

export const ResourceSectionWrapper = styled.div`
padding-left:1rem;
padding-right:1rem;
/* margin-top:5rem; */
`

interface ResourceSectionItemProps {
  directionReverse: boolean;
}

export const ResourceSectionItem = styled.div<ResourceSectionItemProps & { $style?: string }>`
padding: 4rem 6rem 2rem 6rem;
display: flex;
align-items: center;
justify-content: space-between;
min-height: 80vh;
flex-direction: ${(props) => props.directionReverse ? "row-reverse" : "row"};
position: relative;
background: linear-gradient(135deg, rgba(39, 122, 255, 0.02) 0%, rgba(0, 0, 0, 0.05) 100%);

&::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(39, 122, 255, 0.3) 50%, transparent 100%);
}

@media(max-width: 968px){
  padding: 3rem 2rem;
}
@media(max-width: 768px){
  flex-direction: column-reverse;
  padding: 3rem 5%;
  min-height: auto;
}
${props => props.$style ?? css`${props.$style}`}
`
export const ResourceSectionInfo = styled.div`
  width: 45%;
  padding: 3rem 4rem 3rem 0;
  position: relative;

h3{
  color: rgba(39, 122, 255, 0.8);
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    left: 0;
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, #277AFF 0%, #4F46E5 100%);
    border-radius: 2px;
  }
}

h2{
  margin-top: 1.5rem;
  color: #fff;
  font-size: 2.5rem;
  font-weight: 600;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #fff 0%, #e0e7ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

p{
  color: rgba(255, 255, 255, 0.85);
  font-size: 1.125rem;
font-weight: 400;
  line-height: 1.7;
  margin-bottom: 2.5rem;
}

button{
  background: linear-gradient(135deg, #277AFF 0%, #4F46E5 100%) !important;
  border: none !important;
  border-radius: 12px !important;
  padding: 0.875rem 2rem !important;
  font-weight: 600 !important;
  font-size: 1rem !important;
  color: white !important;
  position: relative !important;
  overflow: hidden !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 4px 15px rgba(39, 122, 255, 0.3) !important;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%);
    transition: left 0.5s ease;
  }
  
  &:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 8px 25px rgba(39, 122, 255, 0.4) !important;
    
    &::before {
      left: 100%;
}
  }
  
  &:active {
    transform: translateY(0) !important;
  }
  
  svg {
    margin-left: 0.5rem !important;
    transition: transform 0.3s ease !important;
  }
  
  &:hover svg {
    transform: translateX(4px) !important;
  }
}

@media(max-width: 968px){
  width: 50%;
  padding: 2rem 2rem 2rem 0;
}

@media(max-width: 768px){
  padding: 1rem;
  width: 100%;
  
  h3{
    font-size: 0.875rem;
    line-height: 1.2;
    margin-bottom: 0.75rem;
  }
  
  h2{
    font-size: 2rem;
    line-height: 1.3;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
  
  p{
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 2rem;
  }
}
`
export const ResourceSectionImage = styled.div`
    width: 55%;
    height: 600px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 2rem;
    
    &::before {
      content: '';
      position: absolute;
      inset: -20px;
      background: linear-gradient(135deg, rgba(39, 122, 255, 0.1) 0%, rgba(79, 70, 229, 0.05) 100%);
      border-radius: 30px;
      z-index: -1;
      transition: all 0.3s ease;
    }

    img{
      height: 100%;
    width: 100%;
      border-radius: 24px;
    object-fit: contain;
      transition: all 0.3s ease;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
    }
    
    &:hover {
      &::before {
        inset: -30px;
        background: linear-gradient(135deg, rgba(39, 122, 255, 0.15) 0%, rgba(79, 70, 229, 0.08) 100%);
      }
      
      img {
        transform: translateY(-4px);
        box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4);
      }
    }
    
    @media(max-width: 968px){
      width: 50%;
      height: 450px;
      margin: 0 1rem;
    }
    
    @media(max-width: 768px){
      height: 300px;
      width: 100%;
      margin: 0 0 2rem 0;
      
      &::before {
        inset: -10px;
        border-radius: 20px;
      }
      
      &:hover {
        &::before {
          inset: -15px;
        }
        
        img {
          transform: translateY(-2px);
        }
      }
      
      img {
        border-radius: 16px;
        height: auto;
        max-height: 300px;
      }
    }
`
interface CaseStudySliderSectionProps {
  column: number;
}
export const CaseStudySliderSection = styled.div<CaseStudySliderSectionProps & { $style?: string }>`
display: flex;
align-items: center;
justify-content: space-between;
padding: 2rem 3rem;
width: 100%;
flex-shrink: 0;
background: rgba(255, 255, 255, 0.02);
border-radius: 20px;
border: 1px solid rgba(255, 255, 255, 0.05);
backdrop-filter: blur(10px);
position: relative;
overflow: hidden;
box-sizing: border-box;

&::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent 0%, rgba(39, 122, 255, 0.5) 50%, transparent 100%);
}

@media(max-width: 1024px){
  flex-direction: column;
  padding: 2rem 1.5rem;
}

@media(max-width: 768px){
  flex-direction: column;
  padding: 1.5rem 1rem;
  border-radius: 16px;
}

${props => props.$style ?? css`${props.$style}`}
`

export const CaseStudyImageSection = styled.div`
width: 30%;
display: flex;
align-items: center;
justify-content: center;
flex-direction: column;
position: relative;

img{
  width: 180px;
  height: 180px;
    border-radius: 50%;
    object-fit: cover;
  border: 4px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    border-color: rgba(39, 122, 255, 0.3);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
  }
}

@media(max-width: 1024px){
  width: 100%;
  margin-bottom: 3rem;
  
  img{
    width: 160px;
    height: 160px;
  }
}

@media(max-width: 768px){
  margin-bottom: 2rem;
  
  img{
    width: 140px;
    height: 140px;
}
}
`

export const CaseStudyInfoSection = styled.div`
width: 70%;
margin-left: 3rem;
position: relative;

.quote-icon {
  position: absolute;
  top: -1rem;
  left: -1rem;
  z-index: 1;
  
  svg {
    width: 48px;
    height: 36px;
    opacity: 0.6;
  }
}

.testimonial-quote {
  font-size: 1.75rem;
  font-weight: 300;
  line-height: 1.5;
  color: #fff;
  font-style: italic;
  margin-bottom: 2rem;
  position: relative;
  z-index: 2;
  padding-left: 2rem;
}

.testimonial-author {
  margin-top: 2rem;
  padding-left: 2rem;
  
  h3 {
    color: #fff;
    font-size: 1.5rem;
    font-weight: 500;
    line-height: 1.4;
    margin-bottom: 0.5rem;
    margin-top: 0;
  }
  
  h5 {
    color: rgba(255, 255, 255, 0.7);
    font-size: 1rem;
    font-weight: 300;
    line-height: 1.5;
    margin: 0;
  }
}

// Legacy support for old structure
p{
  font-size: 1.75rem;
  font-weight: 300;
  line-height: 1.5;
  color: #fff;
  font-style: italic;
  margin-bottom: 2rem;
}

h3{
  margin-top: 1.5rem;
  color: #fff;
  font-size: 1.5rem;
font-weight: 500;
  line-height: 1.4;
  margin-bottom: 0.5rem;
}

h5{
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  font-weight: 300;
  line-height: 1.5;
}

@media (max-width: 1024px){
  width: 100%;
  margin-left: 0;
  text-align: left;
  
  .quote-icon {
    position: relative;
    top: 0;
    left: 0;
    margin-bottom: 1rem;
    display: flex;
    justify-content: flex-start;
  }
  
  .testimonial-quote {
    padding-left: 0;
    text-align: left;
  }
  
  .testimonial-author {
    padding-left: 0;
    text-align: left;
  }
}

@media (max-width: 768px){
  .testimonial-quote {
    font-size: 1.25rem;
    line-height: 1.6;
    margin-bottom: 1.5rem;
    padding-left: 0;
  }
  
  .testimonial-author {
    padding-left: 0;
    
    h3 {
      font-size: 1.25rem;
      margin-top: 1rem;
      margin-bottom: 0.5rem;
    }
    
    h5 {
      font-size: 0.875rem;
    }
  }
  
  // Legacy support
  p{
    font-size: 1.25rem;
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }
  
  h3{
    font-size: 1.25rem;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }
  
  h5{
    font-size: 0.875rem;
  }
}
`

export const TestimonialSectionWrapper = styled.div<{ $style?: string }>`
padding: 6rem 0 3rem 0;
background: linear-gradient(135deg, rgba(39, 122, 255, 0.03) 0%, rgba(0, 0, 0, 0.05) 100%);
min-height: 80vh;
position: relative;

.section-content {
  padding: 0 6rem;
}

&::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(39, 122, 255, 0.3) 50%, transparent 100%);
}

@media (max-width: 768px) {
  padding: 4rem 0;
  
  .section-content {
    padding: 0 5%;
  }
}

${props => props.$style && css`${props.$style}`}
`

export const TestimonialSectionTitle = styled.div`
text-align: left;
margin-bottom: 4rem;
position: relative;

h2 {
  font-size: 3.5rem;
  font-weight: 300;
  line-height: 1.2;
  color: #fff;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
}

p {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.8);
  max-width: 700px;
  margin: 0;
  line-height: 1.6;
  font-weight: 300;
}

&::after {
  content: '';
  position: absolute;
  bottom: -2rem;
  left: 0;
  width: 120px;
  height: 4px;
  background: linear-gradient(90deg, rgba(39, 122, 255, 0.8) 0%, transparent 100%);
  border-radius: 2px;
}

@media (max-width: 1024px) {
  margin-bottom: 3rem;
  
  h2 {
    font-size: 3rem;
  }
  
  p {
    font-size: 1.125rem;
  }
}

@media (max-width: 768px) {
  margin-bottom: 2.5rem;
  
  h2 {
    font-size: 2.5rem;
    line-height: 1.2;
  }
  
  p {
    font-size: 1rem;
    line-height: 1.5;
    padding: 0 1rem;
  }
  
  &::after {
    bottom: -1.5rem;
    width: 80px;
    height: 3px;
  }
}
`

export const GigaBlogWrapper = styled.div`
display:flex;
align-items:center;
justify-content:end;
    padding: 0 3rem 5rem;

`

export const FaqSectionTitle = styled.div`
text-align: left;
margin-bottom: 3rem;
position: relative;
width: 100%;

h2 {
  font-size: 3rem;
  font-weight: 300;
  color: #fff;
  margin-bottom: 1.25rem;
  position: relative;
  line-height: 1.2;
}

p {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 300;
  line-height: 1.6;
  max-width: 800px;
  margin: 0;
}

&::after {
  content: '';
  position: absolute;
  bottom: -1rem;
  left: 0;
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #277AFF 0%, #4F46E5 100%);
  border-radius: 2px;
}

@media (max-width: 768px) {
  margin-bottom: 2.5rem;
  
  h2 {
    font-size: 2.5rem;
  }
  
  p {
    font-size: 1.125rem;
    max-width: 100%;
  }
}
`

export const FaqSection = styled.div<{ $style?: string }>`
padding: 4rem 0 3rem 0;
display: flex;
flex-direction: column;
align-items: flex-start;
justify-content: flex-start;
background: linear-gradient(135deg, rgba(39, 122, 255, 0.02) 0%, rgba(0, 0, 0, 0.05) 100%);
position: relative;

.section-content {
  padding: 0 6rem;
  width: 100%;
  max-width: none;
}

&::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(39, 122, 255, 0.3) 50%, transparent 100%);
}

.faq-title{
  color:#9E9E9E;
  text-align:center;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

@media (max-width: 768px) {
  padding: 3rem 0 2rem 0;
  
  .section-content {
    padding: 0 5%;
  }
}

${props => props.$style ?? css`${props.$style}`}
`
export const FaqQuestions = styled.div`
margin-top: 0;
width: 100%;

.faq-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  width: 100%;
}

.faq-column {
  width: 100%;
}

.cds--accordion {
  border: none;
}

.cds--accordion__item {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  margin-bottom: 1rem;
  overflow: hidden;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(39, 122, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
}

.cds--accordion__heading {
  background: transparent;
  border: none;
  padding: 1.5rem 2rem;
  position: relative;
  
  &::before {
    display: none;
  }
  
  &:hover {
    background: transparent;
  }
  
  &:focus {
    outline: none;
    box-shadow: none;
  }
}

.cds--accordion__arrow {
  fill: #277AFF;
  width: 20px;
  height: 20px;
  transition: all 0.3s ease;
  margin-right: 0;
  margin-left: 1rem;
  flex-shrink: 0;
}

.cds--accordion__item[aria-expanded="true"] .cds--accordion__arrow {
  transform: rotate(90deg);
}

.cds--accordion__title {
  color: #fff;
  font-size: 1.125rem;
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: -0.01em;
    text-align: left;
  padding: 0;
  margin: 0;
  flex: 1;
}

.cds--accordion__content {
  font-size: 1rem;
  font-weight: 300;
  line-height: 1.6;
  letter-spacing: 0;
    text-align: left;
  color: rgba(255, 255, 255, 0.85);
  padding: 0 2rem 2rem 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  margin-top: 0;
  
  p {
    margin: 0;
    color: rgba(255, 255, 255, 0.85);
  }
}

@media (max-width: 768px) {
  .faq-columns {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .cds--accordion__heading {
    padding: 1.25rem 1.5rem;
  }
  
  .cds--accordion__title {
    font-size: 1rem;
    line-height: 1.4;
  }
  
  .cds--accordion__content {
    padding: 0 1.5rem 1.5rem 1.5rem;
    font-size: 0.9375rem;
    line-height: 1.6;
  }
  
  .cds--accordion__arrow {
    width: 18px;
    height: 18px;
    margin-left: 0.75rem;
  }
}
`



export const AboutInfoButtonWrapper = styled.div`
display: flex;
`

export const FooterSection = styled.div<{ $style?: string }>`
padding: 6rem 0 4rem 0;
margin-top: 8rem;
background: linear-gradient(135deg, rgba(39, 122, 255, 0.02) 0%, rgba(0, 0, 0, 0.8) 100%);
position: relative;
border-top: 1px solid rgba(255, 255, 255, 0.05);

.section-content {
  padding: 0 6rem;
}

&::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent 0%, rgba(39, 122, 255, 0.5) 50%, transparent 100%);
}

@media (max-width:768px){
  padding: 4rem 0 2rem 0;
  
  .section-content {
    padding: 0 5%;
  }
}
${props => props.$style && css`${props.$style}`}
`

export const FooterTitleSection = styled.div`
margin-bottom: 4rem;
padding-bottom: 2rem;
border-bottom: 1px solid rgba(255, 255, 255, 0.08);

.footer-logo {
  margin-bottom: 1.5rem;
  
  svg, img {
    max-height: 2.5rem;
    filter: brightness(1.1);
  }
}

p {
  margin-top: 1rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.125rem;
  font-weight: 300;
  line-height: 1.6;
text-align: left;
  max-width: 500px;
}

@media (max-width:768px){
  margin-bottom: 3rem;
  padding-bottom: 1.5rem;
  
  p {
    margin-top: 0.75rem;
    font-size: 1rem;
    line-height: 1.5;
    max-width: 100%;
  }
}
`

export const FooterLinksSection = styled.div`
display: grid;
grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
gap: 3rem;
margin-bottom: 4rem;

.link-list-item {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 2rem 1.5rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(39, 122, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
}

h4 {
  color: #fff;
  font-size: 1.25rem;
font-weight: 500;
  line-height: 1.4;
text-align: left;
  margin-bottom: 1.5rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    left: 0;
    width: 40px;
    height: 2px;
    background: linear-gradient(90deg, #277AFF 0%, #4F46E5 100%);
    border-radius: 1px;
  }
}

.footer-link-wrapper { 
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  
  a {
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    font-size: 0.95rem;
    font-weight: 300;
    line-height: 1.5;
    padding: 0.25rem 0;
    transition: all 0.2s ease;
    position: relative;
    
    &:hover {
      color: #277AFF;
      padding-left: 0.5rem;
      
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 3px;
        background: #277AFF;
        border-radius: 50%;
      }
    }
  }
}

@media (max-width: 768px) {
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
  
.link-list-item {
    padding: 1.5rem 1rem;
  }
  
  h4 {
    font-size: 1.125rem;
    margin-bottom: 1rem;
  }
  
  .footer-link-wrapper a {
    font-size: 0.875rem;
  }
}

@media (max-width: 480px) {
  grid-template-columns: 1fr;
  gap: 1.5rem;
}
`
export const FooterMediaSection = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
padding-top: 2rem;
border-top: 1px solid rgba(255, 255, 255, 0.08);
flex-wrap: wrap;
gap: 2rem;

.right-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  
  p {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.875rem;
    font-weight: 300;
    line-height: 1.4;
    margin: 0;
    
    a {
      color: #277AFF;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s ease;
      
      &:hover {
        color: #4F46E5;
}
    }
  }
  
  svg {
    fill: rgba(255, 255, 255, 0.8);
    transition: all 0.2s ease;
    
    &:hover {
      fill: #277AFF;
    }
}
}

.left-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  
  a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(39, 122, 255, 0.1);
      border-color: rgba(39, 122, 255, 0.3);
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(39, 122, 255, 0.2);
    }
    
    svg {
      fill: rgba(255, 255, 255, 0.8);
      width: 20px;
      height: 20px;
      transition: fill 0.2s ease;
}
    
    &:hover svg {
      fill: #277AFF;
    }
  }
}

@media (max-width: 768px) {
  flex-direction: column;
  align-items: flex-start;
  gap: 1.5rem;
  padding-top: 1.5rem;
  
  .right-section {
    order: 2;
    gap: 0.75rem;
    
    p {
      font-size: 0.8125rem;
    }
  }
  
  .left-section {
    order: 1;
    gap: 0.75rem;
    
    a {
      width: 40px;
      height: 40px;
      
      svg {
        width: 18px;
        height: 18px;
      }
    }
  }
}

@media (max-width: 480px) {
  .left-section {
    justify-content: center;
    width: 100%;
  }
  
  .right-section {
    justify-content: center;
    width: 100%;
    text-align: center;
  }
}
`
export const ExploreGigaMapButton = styled.div`
  button {
    border-radius: 2rem;
  }
`

export const GetInTouchSection = styled.div`
  min-height: 80vh;
  padding: 4rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(39, 122, 255, 0.03) 0%, rgba(79, 70, 229, 0.03) 100%);
  position: relative;

  .section-content {
    padding: 0 6rem;
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
  }



  @media (max-width: 768px) {
    min-height: 70vh;
    padding: 3rem 0;
    
    .section-content {
      padding: 0 5%;
    }
  }
`

export const GetInTouchSectionTitle = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;

  h2 {
    font-size: 3.5rem;
    font-weight: 300;
    margin: 0 0 1.5rem 0;
    color: #fff;
    line-height: 1.2;
    background: linear-gradient(135deg, #fff 0%, #e0e7ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  p {
    font-size: 1.25rem;
    color: #C8C8C8;
    margin: 0;
    line-height: 1.6;
    font-weight: 300;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  @media (max-width: 768px) {
    margin-bottom: 2rem;
    
    h2 {
      font-size: 2.5rem;
    }
    
    p {
      font-size: 1.1rem;
    }
  }

  @media (max-width: 480px) {
    h2 {
      font-size: 2rem;
    }
    
    p {
      font-size: 1rem;
    }
  }
`

export const GetInTouchContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  .contact-description {
    text-align: center;
    margin: 2rem 0;
    max-width: 700px;
    
    p {
      font-size: 1.125rem;
      color: #B0B0B0;
      line-height: 1.6;
      margin: 0;
      font-weight: 300;
    }
  }

  @media (max-width: 768px) {
    .contact-description {
      margin: 1.5rem 0;
      
      p {
        font-size: 1rem;
      }
    }
  }
`

export const GetInTouchStats = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding: 2rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 1rem;

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .stat-number {
    font-size: 2.5rem;
    font-weight: 300;
    background: linear-gradient(135deg, #277AFF 0%, #4F46E5 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1.1;
    margin-bottom: 0.5rem;
  }

  .stat-label {
    font-size: 0.9rem;
    color: #B0B0B0;
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .stat-divider {
    width: 1px;
    height: 60px;
    background: linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
    padding: 1.5rem;
    
    .stat-divider {
      width: 60px;
      height: 1px;
      background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%);
    }
    
    .stat-number {
      font-size: 2rem;
    }
    
    .stat-label {
      font-size: 0.8rem;
    }
  }

  @media (max-width: 480px) {
    padding: 1rem;
    gap: 1rem;
    
    .stat-number {
      font-size: 1.75rem;
    }
  }
`

export const GetInTouchButton = styled.div`
  margin-top: 1rem;
  
  button {
    padding: 1rem 2rem;
    border-radius: 50px;
    font-size: 1.1rem;
    font-weight: 500;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 8px 24px rgba(39, 122, 255, 0.2);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 32px rgba(39, 122, 255, 0.3);
    }
    
    .cds--btn__icon {
      margin-left: 0.5rem;
      width: 20px;
      height: 20px;
      fill: currentColor;
    }
  }

  @media (max-width: 768px) {
    button {
      padding: 0.875rem 1.75rem;
      font-size: 1rem;
      
      .cds--btn__icon {
        width: 18px;
        height: 18px;
        margin-left: 0.375rem;
      }
    }
  }

  @media (max-width: 480px) {
    button {
      padding: 0.75rem 1.5rem;
      font-size: 0.9rem;
      
      .cds--btn__icon {
        width: 16px;
        height: 16px;
        margin-left: 0.25rem;
      }
    }
  }
`

export const getInTouchStyle = css`
  .cds--modal {
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(10px);
  }
  
  .cds--modal-container {
    background: rgba(20, 20, 20, 0.95);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 24px;
    box-shadow: 0 24px 64px rgba(0, 0, 0, 0.4);
    max-width: 600px;
    min-height: auto;
  }
  
  .cds--modal-header {
    background: linear-gradient(135deg, rgba(39, 122, 255, 0.1) 0%, rgba(79, 70, 229, 0.1) 100%);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 24px 24px 0 0;
    padding: 2rem 2rem 1rem 2rem;
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, #277AFF 0%, #4F46E5 100%);
      border-radius: 24px 24px 0 0;
  }
  }
  
  h4 {
    color: #fff;
    font-size: 1.75rem;
    font-weight: 300;
    line-height: 1.3;
    margin: 0;
    text-align: center;
    background: linear-gradient(135deg, #277AFF 0%, #4F46E5 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .form-title {
    color: #C8C8C8;
    font-size: 1rem;
    text-align: center;
    margin: 1.5rem 0 2rem 0;
    font-weight: 300;
    line-height: 1.5;
  }

  .cds--modal-content {
    padding: 0 2rem 2rem 2rem;
    background: transparent;
  }
  
  .cds--form-item {
    margin-bottom: 1.5rem;
    
    label {
      color: #E0E0E0;
      font-size: 0.875rem;
      font-weight: 500;
      margin-bottom: 0.5rem;
      display: block;
    }
    
    input, select, textarea {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 12px;
      padding: 0.875rem 1rem;
      color: #fff;
      font-size: 0.95rem;
      width: 100%;
      transition: all 0.2s ease;
      
      &:focus {
        background: rgba(255, 255, 255, 0.08);
        border-color: #277AFF;
        box-shadow: 0 0 0 2px rgba(39, 122, 255, 0.2);
        outline: none;
      }
      
      &::placeholder {
        color: #888;
      }
    }
    
    select {
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23999' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
      background-position: right 0.75rem center;
      background-repeat: no-repeat;
      background-size: 1rem;
      padding-right: 2.5rem;
      appearance: none;
    }
    
    textarea {
      min-height: 120px;
      resize: vertical;
      font-family: inherit;
    }
  }
  
  .cds--modal-footer {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.2);
    border-radius: 0 0 24px 24px;
    padding: 1.5rem 2rem;
    position: relative;
  }
  
  .submit-btn {
    width: 100%;
    background: linear-gradient(135deg, #277AFF 0%, #4F46E5 100%);
    border: none;
    border-radius: 50px;
    padding: 0.875rem 2rem;
    font-size: 1rem;
    font-weight: 500;
    color: white;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 8px 24px rgba(39, 122, 255, 0.3);
    
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 12px 32px rgba(39, 122, 255, 0.4);
    }
    
    &:disabled {
      background: rgba(255, 255, 255, 0.1);
      color: #666;
      cursor: not-allowed;
      box-shadow: none;
    }
    
    .cds--btn__icon {
      margin-left: 0.5rem;
      width: 18px;
      height: 18px;
    }
  }
  
  .cds--modal-close {
    color: #C8C8C8;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    padding: 0;
    transition: all 0.2s ease;
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
      color: #fff;
    }
    
    .cds--modal-close__icon {
      width: 20px;
      height: 20px;
  }
  }
  
  .cds--layer-one {
    background: none;
  }
  
  @media (max-width: 768px) {
    .cds--modal-container {
      margin: 1rem;
      border-radius: 20px;
    }
    
    .cds--modal-header {
      padding: 1.5rem 1.5rem 1rem 1.5rem;
      border-radius: 20px 20px 0 0;
      
      &::before {
        border-radius: 20px 20px 0 0;
      }
    }
    
    h4 {
      font-size: 1.5rem;
    }
    
    .cds--modal-content {
      padding: 0 1.5rem 1.5rem 1.5rem;
    }
    
    .cds--modal-footer {
      padding: 1rem 1.5rem;
      border-radius: 0 0 20px 20px;
    }
  }
`