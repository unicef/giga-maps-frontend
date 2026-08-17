import { useStore } from 'effector-react';

import GigaMapsLogo from '~/assets/images/GigaMaps.svg';
import { Separator } from '~/components/ui/separator';
import { cn } from '~/lib/cn';

import { LANDING_CONTAINER } from '../landing.constant';
import { $footer } from '../landing.model';

// Raw HTML from the admin: no classes, inherits Carbon. Restyled from outside.
const cmsHtml = cn(
  '[&_a]:text-sm! [&_a]:text-muted-foreground! [&_a]:transition-colors hover:[&_a]:text-foreground!',
  '[&_ul]:m-0! [&_ul]:flex! [&_ul]:list-none! [&_ul]:flex-col! [&_ul]:gap-3! [&_ul]:p-0!',
  // The admin authors link groups as `<div class="footer-link-wrapper">`.
  '[&_.footer-link-wrapper]:flex! [&_.footer-link-wrapper]:flex-col! [&_.footer-link-wrapper]:gap-3!',
  '[&_li]:m-0! [&_p]:m-0! [&_p]:text-sm! [&_p]:text-muted-foreground!',
  '[&_h1]:text-base! [&_h2]:text-base! [&_h3]:text-base! [&_h4]:text-base!',
  '[&_h1]:text-foreground! [&_h2]:text-foreground! [&_h3]:text-foreground! [&_h4]:text-foreground!',
  '[&_h1]:mb-4! [&_h2]:mb-4! [&_h3]:mb-4! [&_h4]:mb-4! [&_h1]:font-semibold! [&_h2]:font-semibold! [&_h3]:font-semibold! [&_h4]:font-semibold!',
  '[&_svg]:size-5! [&_img]:h-5! [&_img]:w-auto!',
);

export const LandingFooter = () => {
  const footer = useStore($footer);

  return (
    <footer
      className="border-t! border-border! bg-landing-background! pt-16! pb-10!"
      data-slot="landing-footer"
    >
      <div className={LANDING_CONTAINER}>
        {/* See landing-header.tsx. */}
        <span className="flex! h-8! items-center! [&_path]:fill-foreground! [&_svg]:h-full! [&_svg]:w-auto!">
          <GigaMapsLogo />
        </span>

        {footer.tagline ? (
          <p className="mt-4! max-w-prose! text-base! text-muted-foreground!">
            {footer.tagline}
          </p>
        ) : null}

        {footer.linkColumns.length > 0 ? (
          <div className="mt-12! grid! gap-6! tablet:grid-cols-3!">
            {footer.linkColumns.map((column, index) => (
              <div
                className={cn(
                  'rounded-lg! border! border-border! bg-card! p-8!',
                  cmsHtml,
                )}
                dangerouslySetInnerHTML={{ __html: column }}
                // Positional HTML blobs with no stable id.
                // eslint-disable-next-line react/no-array-index-key
                key={index}
              />
            ))}
          </div>
        ) : null}

        <Separator className="my-10!" />

        <div className="flex! flex-col! gap-6! tablet:flex-row! tablet:items-center! tablet:justify-between!">
          <p className="text-sm! text-muted-foreground!">
            {`© ${new Date().getFullYear()}`}
          </p>

          {footer.socialLinks.length > 0 ? (
            <div className="flex! items-center! gap-3!">
              {footer.socialLinks.map((link, index) => (
                <div
                  className={cn(
                    'flex! size-10! items-center! justify-center! rounded-md! border! border-border! bg-card! transition-shadow hover:shadow-sm!',
                    cmsHtml,
                  )}
                  dangerouslySetInnerHTML={{ __html: link }}
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </footer>
  );
};
