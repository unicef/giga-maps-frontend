import { Accordion, AccordionItem, PaginationNav } from "@carbon/react";
import { useMemo, useState } from "react";

import { FaqPaginationWrapper, FaqQuestions, FaqSection, FaqSectionTitle } from "../styles/about-giga-map-styles";
import { AboutType } from "../about.type";

const FrequentlyAskedQuestions = ({ data }: { data: AboutType }) => {

  const [page, setPage] = useState(0)

  const itemsPerPage = 5;
  const startIndex = (page) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const content = useMemo(() => {
    return data?.content.slice(startIndex, endIndex)
  }, [startIndex, endIndex, data])

  return (
    <FaqSection id={data?.type} $style={data.style}>
      <FaqSectionTitle>
        <h2>{data?.title}</h2>
        <p>Find answers to common questions about Giga Maps and our school connectivity platform</p>
      </FaqSectionTitle>

      <FaqQuestions>
        <Accordion>
          {
            content.map((faq, index) => (
              <AccordionItem key={`${faq.title}-${index}`} title={faq?.title}>
                <p dangerouslySetInnerHTML={{ __html: faq?.text?.[0] ?? '' }} />
              </AccordionItem>
            ))
          }
        </Accordion>
      </FaqQuestions>

      {Math.ceil(data?.content.length / itemsPerPage) > 1 && (
        <FaqPaginationWrapper>
          <PaginationNav
            page={page}
            onChange={(page: number) => {
              setPage(page)
            }}
            totalItems={Math.ceil(data?.content.length / itemsPerPage)}
          />
        </FaqPaginationWrapper>
      )}
    </FaqSection>
  )
}
export default FrequentlyAskedQuestions