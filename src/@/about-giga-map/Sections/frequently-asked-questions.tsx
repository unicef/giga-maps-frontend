import { Accordion, AccordionItem } from "@carbon/react";

import { FaqQuestions, FaqSection, FaqSectionTitle } from "../styles/about-giga-map-styles";
import { AboutType } from "../about.type";

const FrequentlyAskedQuestions = ({ data }: { data: AboutType }) => {
  // Split FAQ items into two columns
  const halfLength = Math.ceil(data?.content.length / 2);
  const leftColumnFaqs = data?.content.slice(0, halfLength);
  const rightColumnFaqs = data?.content.slice(halfLength);

  return (
    <FaqSection id={data?.type} $style={data.style}>
      <div className="section-content">
        <FaqSectionTitle>
          <h2>{data?.title}</h2>
          <p>Find answers to common questions about Giga Maps and our school connectivity platform</p>
        </FaqSectionTitle>

        <FaqQuestions>
          <div className="faq-columns">
            <div className="faq-column">
              <Accordion>
                {leftColumnFaqs.map((faq, index) => (
                  <AccordionItem key={`left-${faq.title}-${index}`} title={faq?.title}>
                    <p dangerouslySetInnerHTML={{ __html: faq?.text?.[0] ?? '' }} />
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <div className="faq-column">
              <Accordion>
                {rightColumnFaqs.map((faq, index) => (
                  <AccordionItem key={`right-${faq.title}-${index}`} title={faq?.title}>
                    <p dangerouslySetInnerHTML={{ __html: faq?.text?.[0] ?? '' }} />
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </FaqQuestions>
      </div>
    </FaqSection>
  )
}
export default FrequentlyAskedQuestions