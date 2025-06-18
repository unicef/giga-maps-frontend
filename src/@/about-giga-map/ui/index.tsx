import { useStore } from 'effector-react';
import { useEffect, useMemo } from 'react';


import FooterLinks from '../Sections/footer-links';
import FrequentlyAskedQuestions from '../Sections/frequently-asked-questions';
import GetInTouch from '../Sections/get-in-touch';
import GigaMapEnbled from '../Sections/giga-map-enabled';
import GigaPartners from '../Sections/giga-partners';
import Infrastructure from '../Sections/infrastructure';
import LiveMap from '../Sections/live-map';
import NavBar from '../Sections/nav-bar';
import Resources from '../Sections/resources';
import SchoolConnected from '../Sections/school-connected';
import SchoolConnectivity from '../Sections/school-connectivity';
import SchoolLocation from '../Sections/school-location';
import CaseStudiesModalSection from '../Sections/case-studies-modal';
import {
  AboutGigaMapModalStyle,
} from "../styles/about-giga-map-styles";
import { $aboutUsContent, connectivityStatsFx, getAboutUsContentFx } from '../about.model';
import Toast from '~/@/common/Toast';
import { fetchGlobalStatsFx } from '~/api/project-connect';


const sectionObj = {
  "live-map": LiveMap,
  "school-connected": SchoolConnected,
  "school-location": SchoolLocation,
  "school-connectivity": SchoolConnectivity,
  "infrastructure": Infrastructure,
  "gigamaps-enabled": GigaMapEnbled,
  "faqs": FrequentlyAskedQuestions,
  "resources": Resources,
  "slides": CaseStudiesModalSection,
  "partners": GigaPartners,
  "live-map-get-in-touch": GetInTouch
} as const

type SectionComponentType = typeof sectionObj[keyof typeof sectionObj];

const AboutGigaMapModal = () => {
  let aboutUsContent = useStore($aboutUsContent)
  const header = useMemo(() => {
    if (!aboutUsContent) {
      return null
    }
    return aboutUsContent.find((item) => item.type === 'header')
  }, [aboutUsContent])
  const footer = useMemo(() => {
    if (!aboutUsContent) {
      return null
    }
    const header = aboutUsContent.find((item) => item.type === 'footer');
    if (!header) {
      return null
    }
    return header
    // return header as AboutType
  }, [aboutUsContent])
  const acknowledgementData = useMemo(() => {
    if (!aboutUsContent) {
      return null
    }
    return aboutUsContent.find((item) => item.type === 'eleventh')
  }, [aboutUsContent])
  useEffect(() => {
    void getAboutUsContentFx();
    void fetchGlobalStatsFx({});
    void connectivityStatsFx();

  }, [])

  return (
    <div>
      <NavBar data={header} />
      <AboutGigaMapModalStyle>
        {
          aboutUsContent?.filter(section => section.type !== "eleventh")?.map((singleSection, index) => {
            const type = singleSection?.type as keyof typeof sectionObj;
            const SectionComponent = sectionObj[type] as SectionComponentType;

            // Hide school-connected section for now
            if (type === "school-connected") {
              return null;
            }

            if (!SectionComponent || !singleSection?.status) {
              return null
            }
            if (SectionComponent) {
              // Pass acknowledgement data to partners component
              if (type === "partners") {
                return <div id={singleSection.type} key={`${index}-${singleSection.title}`}>
                  <SectionComponent data={singleSection} acknowledgementData={acknowledgementData || undefined} />;
                </div>
              }

              return <div id={singleSection.type} key={`${index}-${singleSection.title}`}>
                <SectionComponent data={singleSection} />;
              </div>
            }
            return null;
          })
        }
        <FooterLinks data={footer} />
      </AboutGigaMapModalStyle>
      <Toast timeout={7000} />
    </div>
  )
}


export default AboutGigaMapModal