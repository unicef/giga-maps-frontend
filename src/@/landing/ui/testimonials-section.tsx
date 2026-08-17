import { useStore } from 'effector-react';
import { Quote } from 'lucide-react';
import { useEffect, useState } from 'react';

import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '~/components/ui/carousel';
import { cn } from '~/lib/cn';

import {
  fillCount,
  LANDING_ANCHOR,
  LANDING_CONTAINER,
  LANDING_COPY,
} from '../landing.constant';
import { $testimonials } from '../landing.model';
import { CmsSectionType } from '../landing.types';

const ARROW =
  'hidden! size-10! cursor-pointer! border-border! bg-transparent! text-foreground! transition-shadow hover:bg-muted! hover:shadow-sm! tablet:flex!';

export const TestimonialsSection = () => {
  const testimonials = useStore($testimonials);
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!api) return undefined;

    // Without this, `loop` leaves every scroll snap at 0: the index advances
    // but the track never moves. Embla sizes the slides before the CMS copy
    // settles, and only re-measures on demand.
    api.reInit();

    const sync = () => setSelected(api.selectedScrollSnap());
    sync();
    api.on('select', sync);

    return () => {
      api.off('select', sync);
    };
  }, [api, testimonials.length]);

  if (testimonials.length === 0) return null;

  const total = testimonials.length;

  return (
    <section
      className={cn(LANDING_CONTAINER, LANDING_ANCHOR, 'py-12! tablet:py-24!')}
      id={CmsSectionType.testimonials}
    >
      <Carousel opts={{ loop: true }} setApi={setApi}>
        <CarouselContent>
          {testimonials.map((item) => (
            <CarouselItem key={item.quote}>
              <figure className="m-0! flex! flex-col! items-start! gap-6! tablet:flex-row! tablet:items-center! tablet:gap-14!">
                {/* Two avatars, one per breakpoint: the design stands it on its
                    own beside the quote on desktop, but tucks it next to the
                    name on mobile, and flex cannot move a node between
                    parents. The hidden one is never fetched. */}
                {item.avatar ? (
                  <img
                    alt=""
                    className="hidden! size-48! shrink-0! rounded-full! object-cover! tablet:block!"
                    loading="lazy"
                    src={item.avatar}
                  />
                ) : null}

                <div className="min-w-0!">
                  <Quote
                    aria-hidden="true"
                    className="mb-6! size-8! text-muted-foreground! tablet:hidden!"
                  />

                  <blockquote className="m-0! font-manrope! text-xl! leading-snug! text-foreground! tablet:text-3xl!">
                    {item.quote}
                  </blockquote>

                  <figcaption className="mt-6! flex! items-center! gap-3! tablet:block!">
                    {item.avatar ? (
                      <img
                        alt=""
                        className="size-12! shrink-0! rounded-full! object-cover! tablet:hidden!"
                        loading="lazy"
                        src={item.avatar}
                      />
                    ) : null}

                    <div className="min-w-0!">
                      {item.name ? (
                        <p className="m-0! text-sm! font-semibold! text-foreground! tablet:text-base!">
                          {item.name}
                        </p>
                      ) : null}
                      {item.attribution ? (
                        <p className="mt-1! mb-0! text-xs! text-muted-foreground! tablet:text-sm!">
                          {item.attribution}
                        </p>
                      ) : null}
                    </div>
                  </figcaption>
                </div>
              </figure>
            </CarouselItem>
          ))}
        </CarouselContent>

        {total > 1 ? (
          <>
            <CarouselPrevious
              aria-label={LANDING_COPY.previousTestimonial}
              className={ARROW}
            />
            <CarouselNext
              aria-label={LANDING_COPY.nextTestimonial}
              className={ARROW}
            />
          </>
        ) : null}
      </Carousel>

      {total > 1 ? (
        <div className="mt-8! flex! justify-center! gap-2! tablet:hidden!">
          {testimonials.map((item, index) => (
            <button
              aria-current={index === selected}
              aria-label={fillCount(LANDING_COPY.goToTestimonial, index + 1)}
              className={cn(
                'size-2! cursor-pointer! rounded-full! border-0! p-0! transition-colors',
                index === selected ? 'bg-primary!' : 'bg-border!',
              )}
              key={item.quote}
              onClick={() => api?.scrollTo(index)}
              type="button"
            />
          ))}
        </div>
      ) : null}
    </section>
  );
};
