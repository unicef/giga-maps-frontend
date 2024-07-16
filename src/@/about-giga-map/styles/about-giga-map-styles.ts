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
padding-left:1rem ;
padding-right: 1rem;
background: #000;
width: 100vw;
position: fixed;
top: 0;
z-index: 10;

.sidebar-menuIcon {
  margin-top: -0.45rem;
  svg {
  fill: #fff;
  }
}

@media (max-width: 768px) {
  padding: 0rem;
}
`

export const AboutGigaMapBodyStyle = styled.div`
  color: #FFF;
  background-color: #000; 
  display: flex;
  padding: 6rem 1rem 4rem 1rem;
  flex-direction: column;
  overflow-y:unset;
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
font-weight: 500;
`

export const Description = styled.p`
  font-size: 1.5rem;
  font-weight: 400;
  line-height: 1.875rem;
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
font-weight: 400;
line-height: 2.8125rem; 
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
    padding: 2rem;
    background: #000;
    min-height: 100vh;
    .resource-wrapper {
      display: flex;
      flex-wrap: wrap;
    }
    ${props => props.$style && css`${props.$style}`}
    @media (max-width: 768px) {
      padding: 0;
    }
`

export const FeatureCardWrapper = styled.a<{ $style?: string }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: calc(100% / 3);
  max-width: calc(100% / 3);
  padding: 1.5rem;
  margin-top:2rem;
  &:hover {
    background: #383838;
  }

  h3{
    color:#fff;
    font-size: 1.25rem;
    font-weight: 500;
    line-height: 1.75rem;
  }

  p{
    color:#fff;
    margin-top:0.75rem;
    margin-bottom:1.25rem;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5rem;
  }
  .bottom-icons {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .arrow-right {
    margin-top: auto;
    align-self: flex-end;
    svg {
      fill: #fff;
    }
  }
  @media (max-width: 768px) {
    min-width: 100%;
      h3{
        font-size: 1.25rem;
        line-height: 1.75rem;
        padding-bottom: 1rem;
      }
      p{
        margin-top: 0;
        font-size: .875rem;
        line-height: 1.25rem;
      }
  }
  ${props => props.$style && css`${props.$style}`}
`

export const CaseStudiesWrapper = styled.div`
    overflow:hidden;
    h1{
    font-size: 3rem;
    font-weight: 500;
    line-height: 3.5rem;
    margin: 0;
    }

`
export const CaseStudiesOneWrapper = styled.div`
    margin-top: 4rem;
    padding-bottom: 5.5rem;
    overflow:hidden;
    h1{
    font-size: 3rem;
    font-weight: 500;
    line-height: 3.5rem;
    margin: 0;
    }

`
export const SliderWrapper = styled.div<{ $style?: string }>`
  ${props => props.$style ?? css`${props.$style}`}
`
export const RightAndLeftWrapper = styled.div<{ $style?: string }>`
display: flex;
align-items: center;
padding: 3rem;
min-height: 100vh;
   
.left{
  position: absolute;
  left: 0;
  z-index:2;
   svg{
        height:20px;
        width:20px;
      }
}
.right{
position: absolute;
right: 0;
z-index:2;
 svg{
        height:20px;
        width:20px;
      }
    }
    ${props => props.$style ?? css`${props.$style}`}

    @media (max-width: 768px) {
      /* margin-left: 1rem;
      margin-right: 1rem; */
      padding: 1rem 8%;
      .left{
        left: 1%;
      }
      .right {
        right: 1%;
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
  

`
export const CaseStudiesOneCardsContainer = styled.div<{ pos: number }>`
  display: flex;
  justify-content: space-between;
  margin-top:2rem;
  transition: all 1s;
  transform: translateX(-${props => props.pos ?? 0}%);
  

`
export const CaseStudiesCard = styled.div<{ column?: number, $style?: string }>`
  flex: 1 1 0;
  padding-left:1rem;
  padding-right:1rem;
  min-width: calc(100% / ${props => props.column ?? 1});
  .right-spacing {
     flex: 1 1 0;
    margin-right: 1px;
  }
  @media (max-width: 768px) {
    padding-left:0.3rem;
    padding-right:0.3rem;  }
  ${props => props.$style ?? css`${props.$style}`}
`
export const CaseStudyPosterWrapper = styled.div`
//height: 297px;
     width: 100%; 
    height: 18rem; 
    // width: 368.33px;
img {
  height:100%;
  width:100%;
  border-radius: 10px;
  object-fit: cover;
}
`
export const CaseStudyInfoBox = styled.div`
height:max-content;
width:100%;
padding: 1.5rem 1rem;

h3{
  margin-top:1rem;
  font-size: 2rem;
  font-weight: 500;
  line-height: 1.75rem;
  color:#fff;
}

p {
  margin-top:3.5rem;
  font-size: 1.125rem;
  font-weight: 400;
  line-height: 1.6875rem;
  color:#fff;
}

@media (max-width: 768px){
  padding: 2rem 0;
  h3{
    margin-top: 0;
    font-size: 1.25rem;
    line-height: 2rem;
    padding-bottom: 1rem;
  }
  p{
    margin-top: 0;
    font-size: .875rem;
    line-height: 1.25rem;
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
padding-left:2rem;
padding-right:2rem;
min-height: 100vh;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
h1{
font-size: 16px;
font-weight: 400;
line-height: 24px;
text-align: center;
margin:0;
color: #9E9E9E;
}
${props => props.$style ?? css`${props.$style}`}
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
align-items:center;
block-size: ${props => props.$size ?? 'auto'};
img, svg {
  // image contain size
  block-size: ${props => props.$size ?? 'auto'};
  object-fit: contain;
}
@media(max-width: 768px){
  img{
    display: none;
  }
}
`

export const NavBarButtonWrapper = styled.div`
    display: flex;
    align-items: center;
    margin-left: auto;
    button{
      margin-left: 3rem;
    }
    @media(max-width: 968px){
      button {
        margin-left: 0;
      }
    }
`
export const NavBarButton = styled.div<{ $active: boolean }>`
margin-right:0.8rem;
a {
font-size: 14px;
font-weight: 500;
color: ${props => props.$active ? '#277AFF' : '#fff'};
}
a:hover{
  color:#277AFF;
}
`
export const AboutSection = styled.div<{ $style?: string }>`
display:flex;
align-items:center;
justify-content: space-between;
width: 100%;
min-height: 100vh;
padding-left: 1rem;
position: relative;
@media(max-width: 768px){
  padding: 0;
}
  ${props => props.$style ?? css`${props.$style}`}
`
export const AboutInfoSection = styled.div`
width:40%;
position: relative;
z-index: 1;
padding-left: 6rem;
.heading {
  color:#fff;
  font-size: 3.75rem;
  font-weight: 400;
  max-width: 32rem;
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
  margin-top:1rem;
  color:#fff;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}
button{
  margin-top:3rem;
}
@media(max-width: 768px){
  width: 70%;
  padding: 2rem 8%;
  .heading {
    font-size: 3rem;
  }
}
`

export const AboutImageSection = styled.div`
width:60%;
position: absolute;
right: 0;
top: 0;
bottom: 0;
display: flex;
align-items: center;
img{
  width:  100%;
  height:  740px;
  object-fit: contain;
  object-position: right;
}
@media(max-width: 768px){
  width:80%;
}
`

export const ImpactSection = styled.div<{ $style?: string }>`
padding-left:6rem;
padding-right:1rem;
min-height: 100vh;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
@media (max-width: 768px){
  padding: 3rem 8%;
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
  font-weight: 400;
  line-height: 24px;
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
  font-weight: 500;
  line-height: 4.375rem;
  margin:0;
  }

p{
  margin-top: 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5rem;
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
padding:2rem 4rem;
display:flex;
align-items:center;
justify-content: space-between;
min-height: 100vh;
flex-direction:${(props) => props.directionReverse ? "row-reverse" : "row"};

@media(max-width: 968px){
  padding-left: 1rem;
  padding-right: 1rem;
}
@media(max-width: 768px){
  flex-direction: column-reverse;
  padding: 2rem 5%;
}
${props => props.$style ?? css`${props.$style}`}
`
export const ResourceSectionInfo = styled.div`
  width: 40%;
  padding: 3rem;
h3{
  color:#9E9E9E;
  font-size: 1.25rem;
  font-weight: 500;
}

h2{
  margin-top:0.5rem;
  color:#f5f5f5;
  font-size: 2rem;
  font-weight: 500;
}

p{
  margin-top:0.5rem;
color:#ECECEC;
font-size: 1rem;
font-weight: 400;
}
button{
  margin-top:2rem;
}
@media(max-width: 768px){
  padding: 0.5rem;
  width: 100%;
  h3{
    font-size: .875rem;
    line-height: 1rem;
    padding-bottom: .25rem;
  }
  h2{
    font-size: 1.25rem;
    line-height: 1.75rem;
    padding-bottom: 1rem;
  }
  p{
    font-size: .875rem;
    line-height: 1.25rem;
  }
}
`
export const ResourceSectionImage = styled.div`
    width: 60%;
    height: 524px;
    

    img{
      height: 100%;
    width: 100%;
    border-radius: 20px;
    object-fit: contain;
    }
    @media(max-width: 768px){
      height: auto;
      width: 100%;
      img {
        height: auto;
      }
    }
`
interface CaseStudySliderSectionProps {
  column: number;
}
export const CaseStudySliderSection = styled.div<CaseStudySliderSectionProps & { $style?: string }>`
display: flex;
align-items:center;
justify-content: space-between;
padding-left:1rem;
padding-right:1rem;
min-width: calc(100% / ${props => props.column ?? 1});

@media(max-width: 768px){
  flex-direction: column;
  padding-left:0.5rem;
  padding-right:0.5rem;
}

${props => props.$style ?? css`${props.$style}`}
`

export const CaseStudyImageSection = styled.div`
width: 30%;
display: flex;
align-items: center;
flex-direction: column;


img{
  width: 177.59px;
    height: 183.41px;
    border-radius: 50%;
    object-fit: cover;
}
@media(max-width: 768px){
  padding: 0 0 2rem 0;
}

`

export const CaseStudyInfoSection = styled.div`
width:70%;
margin-left: 1rem;
p{
font-size: 28px;
font-weight: 500;
line-height: 36px;
color:#ECECEC;
}
h3{
  margin-top:1rem;
  color:#F5F5F5;
font-size: 20px;
font-weight: 500;
line-height: 28px;
}

h5{
  margin-top:0.5rem;
  color:#9E9E9E;
font-size: 14px;
font-weight: 400;
line-height: 20px;
}
@media (max-width: 768px){
  width: auto;
  p{
    font-size: 1.5rem;
    line-height: 1.875rem;
    padding-bottom: 1rem;
  }
  h3{
    margin-top: 0;
    padding-bottom: .25rem;
  }
  h5{
    margin-top: 0;
  }
}
`

export const GigaBlogWrapper = styled.div`
display:flex;
align-items:center;
justify-content:end;
    padding: 0 3rem 5rem;

`

export const FaqSection = styled.div<{ $style?: string }>`
 padding: 2rem;
 display: flex;
 flex-direction: column;
 align-items: center;
justify-content: center;
min-height: 100vh;
.faq-title{
  color:#9E9E9E;
  text-align:center;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}
${props => props.$style ?? css`${props.$style}`}
`
export const FaqQuestions = styled.div`
margin-top:2rem;
max-width:37.5rem;
width: 100%;
.cds--accordion__arrow{
  fill:#fff;
}

.cds--accordion__heading:hover::before {
  background-color: transparent;
  color:#277AFF;
}
.cds--accordion__heading:focus::before {
  border:none;
}
.cds--accordion__title{
  color: #fff;
    font-family: Open Sans;
    font-size: 16px;
    font-weight: 700;
    line-height: 50px;
    letter-spacing: -1px;
    text-align: left;
    padding-left: 0;
    padding-right: 0;
    padding-top: 1rem;
    padding-bottom: 1rem;
}
.cds--accordion__content {
  font-family: Open Sans;
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    letter-spacing: 0px;
    text-align: left;
    color: #ECECEC;
    padding-left: 0;
    padding-right: 0;
    padding-bottom: 2rem;
}
`

export const FaqPaginationWrapper = styled.div`
display:flex;
align-items:center;
justify-content: flex-end;
    width: 65%;
    margin-top: 1rem;
    .cds--btn--ghost:not([disabled]) svg{
      fill:#fff;
    }
    .cds--pagination-nav__page{
      color:#fff;
    }
`

export const AboutInfoButtonWrapper = styled.div`
display: flex;
`

export const FooterSection = styled.div<{ $style?: string }>`
padding-left: 7rem;
padding-right: 7rem;
margin-top:5rem;
padding-bottom:5rem;
@media (max-width:996px){
  padding-left: 2rem;
  padding-right: 2rem;
}
@media (max-width:768px){
  padding-left: 1rem;
  padding-right: 1rem;
}
${props => props.$style && css`${props.$style}`}
`

export const FooterTitleSection = styled.div`
p{
  margin-top:1rem;
  color: #C8C8C8;
font-size: 16px;
font-weight: 400;
line-height: 24px;
text-align: left;
}
@media (max-width:768px){
  p{
    margin-top: 0;
    font-size: 1rem;
    line-height: 1.5rem;
  }
}
`

export const FooterLinksSection = styled.div`
display:flex;
flex-flow: wrap;
gap: 10%;
h4 {
  color:#fff;
font-size: 20px;
font-weight: 500;
line-height: 28px;
text-align: left;
}
.footer-link-wrapper { 
  display:flex;
  flex-direction:column;
      margin-top: 0.5rem;
    
      a{
        margin-top:0.5rem;
        color:#C8C8C8;

      }
      @media (max-width:768px){
        margin-top: 0;
        a{
          margin-top: 0;
        }
      }
}
.link-list-item {
  min-width: 10rem;
  margin-top:3rem;
  @media (max-width:768px){
    margin-top: 2rem;
  }
}
@media (max-width:768px){
  h4{
    font-size: .875rem;
    line-height: 1.25rem;
    margin-bottom: .5rem;
  }
  a{
    font-size: .875rem;
    line-height: 1.25rem;
    margin-bottom: .25rem;
  }
}
`
export const FooterMediaSection = styled.div`
display:flex;
align-items:center;
justify-content:space-between;
margin-top:2rem;
flex-flow: wrap;

.right-section{
  display:flex;
  align-items:center;
  flex-flow: wrap;
  margin-top: 1rem;
p{
color:#fff;
font-size: 14px;
font-weight: 400;
line-height: 1.25rem;
text-align: left;
margin-right:0.4rem;
}
a{
  color:#fff;
}
svg{
  fill:#fff;
  margin-left:0.5rem;
  margin-top: 0.5rem;

}
}

.left-section{
  display:flex;
  align-items:center;
  flex-flow: wrap;
  svg{
  fill:#fff;
  margin-right:0.5rem;
}
}
@media (max-width: 768px) {
  margin-top: 1rem;
  .left-section{
    margin-top: 1rem;
  }
}
`
export const ExploreGigaMapButton = styled.div`
  button {
    border-radius: 2rem;
  }
`

export const GetInTouchSection = styled.div`
  min-height: 30vh;
  padding: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  button {
    border-radius: 2rem;
    transform: scale(1.5);
  }
`

export const getInTouchStyle = css`
  background: #222222;
  .cds--modal-header {
    border-bottom: 1px solid #494949;
    padding: 1.5rem 0.5rem 0.5rem 1rem;
  }
  h4 {
    color: #fff;
    line-height: 1.25rem;
    margin: 1rem 0;
    text-align: center;
  }

  .cds--modal-content {
    padding: 1rem 10%;
  }
  .cds--form-item {
    margin-top: 1rem;
    input, select, textarea {
      padding: 0.5rem 1rem;
    }
  }
  .cds--modal-footer {
    block-size: 3rem;
    position: absolute;
    bottom: 0;
    width: 100%;
  }
  .submit-btn {
    flex: 1;
    block-size: 3rem;
    .cds--btn__icon {
      margin-block-start: 0.455rem;
    }
  }
  .cds--modal-content {
    padding-bottom: 2rem;
  }
  .cds--layer-one {
    background: none;
  }
  input, select, textarea {
    background: #333333;
  }
`