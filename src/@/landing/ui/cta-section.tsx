import { useStore } from 'effector-react';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';

import { Button } from '~/components/ui/button';
import { cn } from '~/lib/cn';

import { LANDING_ANCHOR, LANDING_CONTAINER } from '../landing.constant';
import { $closingCta } from '../landing.model';
import { CmsSectionType } from '../landing.types';
import { GetInTouchDialog } from './get-in-touch-dialog';
import { StatsRow } from './stats-row';

// The old /about opened the contact modal from this button, and the CMS still
// stores it as a link to that page. Match on the link: the label arrives
// translated, so comparing against it would only ever work in English.
const opensContactForm = (link: string) =>
  link.replace(/\/$/, '').endsWith('/about');

export const CtaSection = () => {
  const cta = useStore($closingCta);
  const [isContactOpen, setIsContactOpen] = useState(false);

  if (!cta.heading && cta.ctas.length === 0) return null;

  return (
    <section
      className={cn(LANDING_ANCHOR, 'bg-card! py-12! tablet:py-28!')}
      id={CmsSectionType.closingCta}
    >
      <div className={cn(LANDING_CONTAINER, 'text-center!')}>
        {cta.heading ? (
          <h2 className="m-0! font-manrope! text-4xl! font-medium! leading-[2.625rem]! text-foreground! tablet:text-5xl! tablet:leading-tight!">
            {cta.heading}
          </h2>
        ) : null}

        {cta.body ? (
          <p className="mx-auto! mt-4! mb-0! max-w-prose! text-base! text-muted-foreground!">
            {cta.body}
          </p>
        ) : null}

        <StatsRow centered={true} className="mt-12!" />

        {cta.note ? (
          <p className="mx-auto! mt-12! mb-0! max-w-prose! text-sm! text-muted-foreground!">
            {cta.note}
          </p>
        ) : null}

        {cta.ctas.length > 0 ? (
          <div className="mt-10! flex! flex-col! items-center! justify-center! gap-4! tablet:flex-row!">
            {cta.ctas.map((item, index) => {
              const buttonClass = cn(
                'h-12! cursor-pointer! rounded-full! px-8! text-base! font-medium! shadow-sm! transition-shadow hover:shadow-md!',
                index === 0
                  ? 'bg-primary! text-primary-foreground! hover:bg-primary/90!'
                  : 'border! border-primary! bg-transparent! text-primary!',
              );

              if (opensContactForm(item.link)) {
                return (
                  <Button
                    className={buttonClass}
                    key={item.link}
                    onClick={() => setIsContactOpen(true)}
                    size="lg"
                    type="button"
                  >
                    {item.text}
                    <ArrowRight aria-hidden="true" className="ml-2 size-4" />
                  </Button>
                );
              }

              return (
                <Button
                  asChild={true}
                  className={buttonClass}
                  key={item.link}
                  size="lg"
                >
                  <a href={item.link} rel="noreferrer" target="_blank">
                    {item.text}
                    <ArrowRight aria-hidden="true" className="ml-2 size-4" />
                  </a>
                </Button>
              );
            })}
          </div>
        ) : null}
      </div>

      <GetInTouchDialog onOpenChange={setIsContactOpen} open={isContactOpen} />
    </section>
  );
};
