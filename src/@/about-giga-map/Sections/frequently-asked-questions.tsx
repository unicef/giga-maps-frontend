import { Accordion, AccordionItem, PaginationNav } from "@carbon/react";
import { useMemo, useState } from "react";

import { FaqPaginationWrapper, FaqQuestions, FaqSection } from "../styles/about-giga-map-styles";
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
    <>
      <FaqSection id={data?.type} $style={data.style}>
        <p className='faq-title'>{data?.title}</p>
        <FaqQuestions>
          <Accordion>
            {
              content.map((faq, index) => (
                <AccordionItem key={index} title={faq?.title}>
                  <p dangerouslySetInnerHTML={{ __html: faq?.text?.[0] ?? '' }} />
                </AccordionItem>
              ))
            }
          </Accordion>
        </FaqQuestions>
        <FaqPaginationWrapper>
          <PaginationNav
            page={page}
            onChange={(page: number) => {
              setPage(page)
            }}
            totalItems={Math.ceil(data?.content.length / itemsPerPage)}
          />
        </FaqPaginationWrapper>
      </FaqSection>
    </>
  )
}
export default FrequentlyAskedQuestions