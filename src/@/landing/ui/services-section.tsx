import { useStore } from 'effector-react';

import { Card, CardContent } from '~/components/ui/card';
import { cn } from '~/lib/cn';

import {
  LANDING_ANCHOR,
  LANDING_CONTAINER,
  LANDING_COPY,
} from '../landing.constant';
import { $services, $servicesIntro } from '../landing.model';
import { CmsSectionType, ServiceData } from '../landing.types';
import { SectionHeading } from './section-heading';

const ServiceBody = ({ service }: { service: ServiceData }) => (
  <>
    {service.icon ? (
      <span className="mb-5! flex! size-11! items-center! justify-center! rounded-md! border! border-border!">
        <img
          alt=""
          className="size-5! object-contain!"
          loading="lazy"
          src={service.icon}
        />
      </span>
    ) : null}

    <h3 className="m-0! text-base! font-semibold! text-foreground!">
      {service.title}
    </h3>

    {service.body ? (
      <p className="mt-2! mb-0! text-sm! text-muted-foreground!">
        {service.body}
      </p>
    ) : null}
  </>
);

export const ServicesSection = () => {
  const intro = useStore($servicesIntro);
  const services = useStore($services);

  if (services.length === 0) return null;

  // Card and CardContent ship their padding unmarked, and Carbon's unlayered
  // CSS beats it — both have to be restated with `!` or the card loses it.
  const card =
    'h-full! rounded-lg! border-border! py-6! transition-shadow hover:bg-muted! hover:shadow-md!';
  const cardBody = 'flex! flex-col! items-start! px-6!';

  return (
    <section
      className={cn(LANDING_CONTAINER, LANDING_ANCHOR, 'py-12! tablet:py-24!')}
      id={CmsSectionType.services}
    >
      <SectionHeading className="mb-10!" intro={intro} />

      <ul className="m-0! grid! list-none! gap-4! p-0! tablet:grid-cols-4! tablet:gap-6!">
        {services.map((service) => (
          <li key={service.id}>
            {service.link ? (
              <a
                aria-label={service.title || LANDING_COPY.logoAlt}
                className="block! h-full! no-underline!"
                href={service.link}
                rel="noreferrer"
                target="_blank"
              >
                <Card className={card}>
                  <CardContent className={cardBody}>
                    <ServiceBody service={service} />
                  </CardContent>
                </Card>
              </a>
            ) : (
              <Card className={card}>
                <CardContent className={cardBody}>
                  <ServiceBody service={service} />
                </CardContent>
              </Card>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};
