import { useStore } from 'effector-react';
import { ArrowRight, Menu } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

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
  const [isScrolled, setIsScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // The bar stays transparent at the top so the hero globe reads through it,
  // and only paints once content starts sliding underneath. The landing owns
  // its scroll container, so the listener goes on the parent, not the window.
  useEffect(() => {
    const scroller = headerRef.current?.parentElement;
    if (!scroller) return undefined;

    const update = () => setIsScrolled(scroller.scrollTop > 8);
    update();
    scroller.addEventListener('scroll', update, { passive: true });
    return () => scroller.removeEventListener('scroll', update);
  }, []);

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

  // Outlined over a 50% scrim while the bar is transparent, so it stays legible
  // over the bright parts of the globe; filled once the bar paints, where the
  // outline would lose contrast.
  const cta =
    header.ctaText && header.ctaLink ? (
      <Button
        asChild={true}
        className={cn(
          'group gap-2! self-start! rounded-full! border! px-6! text-base! font-medium! shadow-sm! transition-colors! duration-300 hover:shadow-md!',
          isScrolled
            ? 'border-primary! bg-primary! text-primary-foreground! hover:border-primary-700! hover:bg-primary-700!'
            : 'border-primary-600! bg-landing-background/50! text-primary-600! hover:bg-landing-background/70!',
        )}
        size="lg"
        variant="outline"
      >
        <a
          href={header.ctaLink}
          onClick={() => setIsMenuOpen(false)}
          rel="noreferrer"
          target="_blank"
        >
          {header.ctaText}
          <ArrowRight
            aria-hidden="true"
            className="size-4 transition-transform group-hover:translate-x-1"
          />
        </a>
      </Button>
    ) : null;

  return (
    <header
      className={cn(
        // The border keeps its box even when transparent: toggling `border-b`
        // would shift the whole page by 1px on scroll.
        'sticky top-0 z-50 w-full border-b border-transparent transition-colors duration-300',
        isScrolled && 'border-border bg-landing-background/95 backdrop-blur',
      )}
      data-slot="landing-header"
      ref={headerRef}
    >
      <div
        className={cn(
          LANDING_CONTAINER,
          'flex! h-14! items-center! justify-between! tablet:h-16!',
        )}
      >
        {/* Wrapper sizes and repaints the logo: `*.svg` is typed without props,
            and the asset has a hard-coded white fill. */}
        <span className="flex! h-6! shrink-0! items-center! [&_path]:fill-foreground! [&_svg]:h-full! [&_svg]:w-auto! tablet:h-7!">
          <GigaMapsLogo />
        </span>

        {isTablet ? (
          <Sheet onOpenChange={setIsMenuOpen} open={isMenuOpen}>
            <SheetTrigger asChild={true}>
              <Button
                aria-label={LANDING_COPY.openMenu}
                className="cursor-pointer! hover:bg-muted!"
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
