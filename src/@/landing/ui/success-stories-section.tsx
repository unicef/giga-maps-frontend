import { useStore } from 'effector-react';
import { useState } from 'react';

import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { cn } from '~/lib/cn';

import {
  fillCount,
  LANDING_ANCHOR,
  LANDING_CONTAINER,
  LANDING_COPY,
  STORIES_PAGE_SIZE,
} from '../landing.constant';
import { $stories, $storiesIntro } from '../landing.model';
import { CmsSectionType } from '../landing.types';
import { SectionHeading } from './section-heading';

export const SuccessStoriesSection = () => {
  const intro = useStore($storiesIntro);
  const stories = useStore($stories);
  const [isExpanded, setIsExpanded] = useState(false);

  if (stories.length === 0) return null;

  const visible = isExpanded ? stories : stories.slice(0, STORIES_PAGE_SIZE);
  const hidden = stories.length - STORIES_PAGE_SIZE;

  return (
    <section
      className={cn(LANDING_CONTAINER, LANDING_ANCHOR, 'py-12! tablet:py-24!')}
      id={CmsSectionType.stories}
    >
      <SectionHeading className="mb-10!" intro={intro} />

      <ul className="m-0! grid! list-none! gap-8! p-0! tablet:grid-cols-3! tablet:gap-6!">
        {visible.map((story) => (
          <li className="flex!" key={story.id}>
            <Card className="h-full! w-full! gap-0! overflow-hidden! rounded-lg! border-border! py-0! transition-shadow hover:bg-muted! hover:shadow-md!">
              {story.image ? (
                <img
                  alt=""
                  className="aspect-[16/10]! w-full! object-cover!"
                  loading="lazy"
                  src={story.image}
                />
              ) : null}

              <CardContent className="flex! flex-1! flex-col! items-start! p-6!">
                {story.title ? (
                  <h3 className="m-0! text-base! font-semibold! text-foreground!">
                    {story.title}
                  </h3>
                ) : null}

                {story.body ? (
                  <p className="mt-2! mb-0! line-clamp-3! text-sm! text-muted-foreground!">
                    {story.body}
                  </p>
                ) : null}

                {story.ctaLink ? (
                  <a
                    className="mt-4! text-sm! font-medium! text-primary! transition-colors hover:text-primary/80!"
                    href={story.ctaLink}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {LANDING_COPY.readStory}
                  </a>
                ) : null}
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>

      {!isExpanded && hidden > 0 ? (
        <div className="mt-10! flex! justify-center!">
          <Button
            className="h-11! cursor-pointer! rounded-full! border! border-primary! bg-transparent! px-6! text-sm! font-medium! text-primary! transition-shadow hover:bg-muted! hover:shadow-sm!"
            onClick={() => setIsExpanded(true)}
            variant="outline"
          >
            {fillCount(LANDING_COPY.showMoreStories, hidden)}
          </Button>
        </div>
      ) : null}
    </section>
  );
};
