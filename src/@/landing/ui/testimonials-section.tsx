import { useStore } from 'effector-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

import { Button } from '~/components/ui/button';
import { cn } from '~/lib/cn';

import {
  LANDING_ANCHOR,
  LANDING_CONTAINER,
  LANDING_COPY,
} from '../landing.constant';
import { $testimonials } from '../landing.model';
import { CmsSectionType } from '../landing.types';

// Hand-rolled: `embla-carousel-react` is not in the project.
export const TestimonialsSection = () => {
  const testimonials = useStore($testimonials);
  const [index, setIndex] = useState(0);

  if (testimonials.length === 0) return null;

  const current = testimonials[Math.min(index, testimonials.length - 1)];
  const total = testimonials.length;
  const step = (delta: number) => setIndex((n) => (n + delta + total) % total);

  return (
    <section
      className={cn(LANDING_CONTAINER, LANDING_ANCHOR, 'py-16! tablet:py-24!')}
      id={CmsSectionType.testimonials}
    >
      <div className="flex! items-center! gap-4! tablet:gap-8!">
        {total > 1 ? (
          <Button
            aria-label={LANDING_COPY.previousTestimonial}
            className="size-10! shrink-0! rounded-full! border! border-border! bg-transparent! text-foreground! transition-shadow hover:shadow-sm!"
            onClick={() => step(-1)}
            size="icon"
            variant="ghost"
          >
            <ChevronLeft className="size-5" />
          </Button>
        ) : null}

        <figure className="m-0! flex! min-w-0! flex-1! flex-col! items-center! gap-8! tablet:flex-row! tablet:gap-14!">
          {current.avatar ? (
            <img
              alt=""
              className="size-32! shrink-0! rounded-full! object-cover! tablet:size-48!"
              loading="lazy"
              src={current.avatar}
            />
          ) : null}

          <div className="min-w-0!">
            <blockquote className="m-0! font-manrope! text-xl! leading-snug! text-foreground! tablet:text-3xl!">
              {current.quote}
            </blockquote>

            <figcaption className="mt-6!">
              {current.name ? (
                <p className="m-0! text-base! font-semibold! text-foreground!">
                  {current.name}
                </p>
              ) : null}
              {current.attribution ? (
                <p className="mt-1! mb-0! text-sm! text-muted-foreground!">
                  {current.attribution}
                </p>
              ) : null}
            </figcaption>
          </div>
        </figure>

        {total > 1 ? (
          <Button
            aria-label={LANDING_COPY.nextTestimonial}
            className="size-10! shrink-0! rounded-full! border! border-border! bg-transparent! text-foreground! transition-shadow hover:shadow-sm!"
            onClick={() => step(1)}
            size="icon"
            variant="ghost"
          >
            <ChevronRight className="size-5" />
          </Button>
        ) : null}
      </div>
    </section>
  );
};
