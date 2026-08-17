import { useStore } from 'effector-react';
import { ArrowRight, Menu } from 'lucide-react';
import { useState } from 'react';

import GigaMapsLogo from '~/assets/images/GigaMaps.svg';
import { Button } from '~/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '~/components/ui/sheet';
import { $isTablet } from '~/core/media-query';
import { cn } from '~/lib/cn';

import { LANDING_CONTAINER, LANDING_COPY } from '../landing.constant';
import { $header } from '../landing.model';

export const LandingHeader = () => {
  const header = useStore($header);
  const isTablet = useStore($isTablet);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = header.items.map((item) => (
    <a
      className="text-base! text-foreground! transition-colors hover:text-primary!"
      href={`#${item.targets[0]}`}
      key={`${item.label}-${item.targets[0]}`}
      onClick={() => setIsMenuOpen(false)}
    >
      {item.label}
    </a>
  ));

  const cta =
    header.ctaText && header.ctaLink ? (
      <a
        className="group inline-flex items-center gap-2 text-base! font-medium! text-primary! transition-colors hover:text-primary/80!"
        href={header.ctaLink}
        rel="noreferrer"
        target="_blank"
      >
        {header.ctaText}
        <ArrowRight
          aria-hidden="true"
          className="size-4 transition-transform group-hover:translate-x-1"
        />
      </a>
    ) : null;

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-border bg-landing-background/95 backdrop-blur"
      data-slot="landing-header"
    >
      <div
        className={cn(
          LANDING_CONTAINER,
          'flex! h-16! items-center! justify-between!',
        )}
      >
        {/* Wrapper sizes and repaints the logo: `*.svg` is typed without props,
            and the asset has a hard-coded white fill. */}
        <span className="flex! h-7! shrink-0! items-center! [&_path]:fill-foreground! [&_svg]:h-full! [&_svg]:w-auto!">
          <GigaMapsLogo />
        </span>

        {isTablet ? (
          <Sheet onOpenChange={setIsMenuOpen} open={isMenuOpen}>
            <SheetTrigger asChild={true}>
              <Button
                aria-label={LANDING_COPY.openMenu}
                size="icon"
                variant="ghost"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              // Carbon paints buttons #161616, hiding the close icon.
              className="w-4/5! bg-background! [&>button]:size-8! [&>button]:text-foreground! [&>button_svg]:size-5!"
              side="right"
            >
              <SheetTitle className="sr-only">
                {LANDING_COPY.openMenu}
              </SheetTitle>
              <nav className="flex! flex-col! gap-6! px-6! pt-14!">
                {navLinks}
                {cta}
              </nav>
            </SheetContent>
          </Sheet>
        ) : (
          <nav className="flex! items-center! gap-8!">
            {navLinks}
            {cta}
          </nav>
        )}
      </div>
    </header>
  );
};
