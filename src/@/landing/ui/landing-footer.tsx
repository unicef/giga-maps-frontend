import { useStore } from 'effector-react';

import { Card } from '~/components/ui/card';
import { Separator } from '~/components/ui/separator';
import { cn } from '~/lib/cn';

import { LANDING_CONTAINER } from '../landing.constant';
import { $footer } from '../landing.model';

// Raw HTML from the admin: no classes, inherits Carbon. Restyled from outside.
const cmsHtml = cn(
  // `[&_a:hover]` targets the hovered link. `hover:[&_a]` would key off the
  // container and light up every link in the block at once.
  '[&_a]:text-sm! [&_a]:text-muted-foreground! [&_a]:transition-colors [&_a:hover]:text-foreground!',
  '[&_ul]:m-0! [&_ul]:flex! [&_ul]:list-none! [&_ul]:flex-col! [&_ul]:gap-3! [&_ul]:p-0!',
  // The admin authors link groups as `<div class="footer-link-wrapper">`.
  '[&_.footer-link-wrapper]:flex! [&_.footer-link-wrapper]:flex-col! [&_.footer-link-wrapper]:gap-3!',
  '[&_li]:m-0! [&_p]:m-0! [&_p]:text-sm! [&_p]:text-muted-foreground!',
  '[&_h1]:text-base! [&_h2]:text-base! [&_h3]:text-base! [&_h4]:text-base!',
  '[&_h1]:text-foreground! [&_h2]:text-foreground! [&_h3]:text-foreground! [&_h4]:text-foreground!',
  '[&_h1]:mb-4! [&_h2]:mb-4! [&_h3]:mb-4! [&_h4]:mb-4! [&_h1]:font-semibold! [&_h2]:font-semibold! [&_h3]:font-semibold! [&_h4]:font-semibold!',
  '[&_svg]:size-5! [&_img]:h-5! [&_img]:w-auto!',
);

// The marks keep the intrinsic size the admin authored: UNICEF is a wordmark and
// ITU a square, so a shared height distorts one of the two.
const accreditationHtml = cn(
  'flex! items-center!',
  '[&_a]:text-xs! [&_a]:text-muted-foreground! [&_a]:transition-colors [&_a:hover]:text-foreground!',
  // Several marks are authored as `<svg fill="none">`; without this the paths
  // inherit `none` and the mark renders blank. See the social links below.
  '[&_svg]:block! [&_svg]:fill-foreground!',
);

export const LandingFooter = () => {
  const footer = useStore($footer);

  return (
    <footer
      className="border-t! border-border! bg-landing-background! pt-16! pb-10!"
      data-slot="landing-footer"
    >
      <div className={LANDING_CONTAINER}>
        {footer.linkColumns.length > 0 ? (
          <div className="grid! gap-4! tablet:grid-cols-3! tablet:gap-6!">
            {footer.linkColumns.map((column, index) => (
              <Card
                className={cn(
                  'block! rounded-lg! border-border! p-8!',
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
          <div className="flex! flex-wrap! items-center! gap-x-3! gap-y-2!">
            {footer.description ? (
              <p className="text-xs! text-muted-foreground!">
                {footer.description}
              </p>
            ) : null}

            <p className="text-xs! text-muted-foreground!">
              {`© ${new Date().getFullYear()}`}
            </p>

            {footer.accreditations.map((mark, index) => (
              <span
                className={accreditationHtml}
                dangerouslySetInnerHTML={{ __html: mark }}
                // eslint-disable-next-line react/no-array-index-key
                key={index}
              />
            ))}
          </div>

          {footer.socialLinks.length > 0 ? (
            <div className="flex! items-center! gap-4!">
              {footer.socialLinks.map((link, index) => (
                <div
                  className={cn(
                    'flex! size-11! items-center! justify-center! rounded-md! border! border-border! bg-card! transition-shadow hover:bg-muted! hover:shadow-sm!',
                    cmsHtml,
                    // The CMS authors the X mark as `<svg fill="none">` with an
                    // unfilled path, so it renders blank without this. Paths that
                    // carry their own `fill` are untouched.
                    '[&_a]:flex! [&_a]:size-full! [&_a]:items-center! [&_a]:justify-center! [&_svg]:fill-foreground!',
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
