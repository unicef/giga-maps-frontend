import { useStore } from 'effector-react';
import { ChevronDown } from 'lucide-react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';
import { cn } from '~/lib/cn';

import { LANDING_ANCHOR, LANDING_CONTAINER } from '../landing.constant';
import { $faqs, $faqsIntro } from '../landing.model';
import { CmsSectionType, FaqData } from '../landing.types';
import { SectionHeading } from './section-heading';

// The repo's Accordion ships without a chevron, so the consumer adds it.
const FaqColumn = ({ items }: { items: FaqData[] }) => (
  <Accordion className="flex! flex-col! gap-4!" type="multiple">
    {items.map((faq) => (
      <AccordionItem
        className="rounded-lg! border! border-border! bg-card! px-5! transition-shadow hover:shadow-sm!"
        key={faq.id}
        value={faq.id}
      >
        <AccordionTrigger className="py-4! text-left! text-base! font-medium! text-foreground! [&[data-state=open]>svg]:rotate-180!">
          {faq.question}
          <ChevronDown
            aria-hidden="true"
            className="size-4 shrink-0 text-muted-foreground transition-transform duration-200"
          />
        </AccordionTrigger>
        {/* Keyframes come from tw-animate-css. `fill-mode-forwards` on close
            stops the box snapping back to full height on the last frame, and
            the spacing lives on an inner div so the animated box has no margin
            of its own to fight the measured height. */}
        <AccordionContent className="overflow-hidden! data-[state=closed]:animate-accordion-up! data-[state=closed]:fill-mode-forwards! data-[state=open]:animate-accordion-down!">
          <div className="pb-4!">
            <p className="m-0! text-sm! leading-relaxed! text-muted-foreground!">
              {faq.answer}
            </p>
          </div>
        </AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
);

export const FaqSection = () => {
  const intro = useStore($faqsIntro);
  const faqs = useStore($faqs);

  if (faqs.length === 0) return null;

  const half = Math.ceil(faqs.length / 2);

  return (
    <section
      className={cn(LANDING_CONTAINER, LANDING_ANCHOR, 'py-16! tablet:py-24!')}
      id={CmsSectionType.faqs}
    >
      <SectionHeading className="mb-10!" intro={intro} />

      <div className="grid! items-start! gap-4! tablet:grid-cols-2! tablet:gap-6!">
        <FaqColumn items={faqs.slice(0, half)} />
        <FaqColumn items={faqs.slice(half)} />
      </div>
    </section>
  );
};
