import { useStore } from 'effector-react';

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

  const card =
    'flex! h-full! flex-col! items-start! rounded-lg! border! border-border! bg-card! p-6! no-underline! transition-shadow';

  return (
    <section
      className={cn(LANDING_CONTAINER, LANDING_ANCHOR, 'py-16! tablet:py-24!')}
      id={CmsSectionType.services}
    >
      <SectionHeading className="mb-10!" intro={intro} />

      <ul className="m-0! grid! list-none! gap-6! p-0! tablet:grid-cols-4!">
        {services.map((service) => (
          <li key={service.id}>
            {service.link ? (
              <a
                aria-label={service.title || LANDING_COPY.logoAlt}
                className={cn(card, 'hover:shadow-md!')}
                href={service.link}
                rel="noreferrer"
                target="_blank"
              >
                <ServiceBody service={service} />
              </a>
            ) : (
              <div className={card}>
                <ServiceBody service={service} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};
