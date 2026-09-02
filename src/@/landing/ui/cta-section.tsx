import { useStore } from 'effector-react';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '~/components/ui/button';
import { cn } from '~/lib/cn';

import {
  CONTACT_HASH,
  LANDING_ANCHOR,
  LANDING_CONTAINER,
} from '../landing.constant';
import { $closingCta } from '../landing.model';
import { CmsSectionType } from '../landing.types';
import { GetInTouchDialog } from './get-in-touch-dialog';
import { StatsRow } from './stats-row';

// The CMS stores this CTA as a link to this same page, which is how it opened
// the contact modal. Match on the link: the label arrives translated, so
// comparing against it would only ever work in English.
const opensContactForm = (link: string) =>
  link.replace(/\/$/, '').endsWith('/about');

const hashOpensContact = () => window.location.hash.slice(1) === CONTACT_HASH;

// Honours the `scroll-mt` that clears the sticky header. Not deferred to a
// frame: `requestAnimationFrame` never runs while the tab is in the background.
const scrollToSection = () =>
  document.getElementById(CmsSectionType.closingCta)?.scrollIntoView();

export const CtaSection = () => {
  const cta = useStore($closingCta);
  const [isContactOpen, setIsContactOpen] = useState(hashOpensContact);
  const hasSection = Boolean(cta.heading) || cta.ctas.length > 0;

  // In-page anchors do not remount the landing, so a link to #contact coming
  // from the header or the footer only fires `hashchange`.
  useEffect(() => {
    const openFromHash = () => {
      if (hashOpensContact()) setIsContactOpen(true);
    };

    window.addEventListener('hashchange', openFromHash);
    return () => window.removeEventListener('hashchange', openFromHash);
  }, []);

  // #contact matches no element, so the browser leaves the page at the top:
  // bring the CTA the dialog belongs to into view behind it. The section only
  // mounts once the CMS answers, long after the browser looked for the hash.
  useEffect(() => {
    if (!hasSection || !isContactOpen || !hashOpensContact()) return;
    scrollToSection();
  }, [hasSection, isContactOpen]);

  const setContactOpen = (open: boolean) => {
    setIsContactOpen(open);
    if (open || !hashOpensContact()) return;

    // Keeping the hash would reopen the dialog on reload and stop a second
    // click on the same link from firing `hashchange`.
    const { pathname, search } = window.location;
    window.history.replaceState(null, '', `${pathname}${search}`);
    // Anything still loading above the CTA has pushed it down since the open.
    scrollToSection();
  };

  // The deep link has to work even when the CMS sends no closing CTA copy.
  if (!hasSection)
    return (
      <GetInTouchDialog onOpenChange={setContactOpen} open={isContactOpen} />
    );

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
                    onClick={() => setContactOpen(true)}
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

      <GetInTouchDialog onOpenChange={setContactOpen} open={isContactOpen} />
    </section>
  );
};
