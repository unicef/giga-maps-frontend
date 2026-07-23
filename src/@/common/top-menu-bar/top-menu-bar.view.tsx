import { useStore } from 'effector-react';
import { Menu, X } from 'lucide-react';

import GigaMapsLogo from '~/assets/images/GigaMaps.svg';
import { Button } from '~/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip';
import { mapOverview } from '~/core/routes';
import { $theme, ThemeType } from '~/core/theme.model';
import { cn } from '~/lib/cn';
import { Link } from '~/lib/router';

const TopMenuBar = ({
  isMenuOpen = false,
  onClickMenu = () => { }
}: { isMenuOpen?: boolean; onClickMenu?: () => void; }) => {
  const isLight = useStore($theme) === ThemeType.light;

  return (
    <div
      className={cn(
        'flex w-full items-center justify-between border-b border-border text-foreground!',
        '[&_.cds--btn--ghost]:!bg-transparent [&_.cds--btn--ghost:hover]:!bg-transparent [&_.cds--btn--ghost:active]:!bg-transparent [&_.cds--btn--ghost:focus]:!bg-transparent',
        '[&_.cds--btn--icon-only]:!flex [&_.cds--btn--icon-only]:!min-h-8 [&_.cds--btn--icon-only]:!min-w-8 [&_.cds--btn--icon-only]:!items-center [&_.cds--btn--icon-only]:!justify-center [&_.cds--btn--icon-only]:!p-0',
        '[&_.cds--popover-caret]:!bg-current [&_.cds--tooltip-content]:!bg-current',
      )}
    >
      <div className="flex h-11 w-full items-center justify-start gap-2 px-3.5! py-0">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => {
                onClickMenu();
              }}
              variant="icon"
              size="icon"
              aria-label={isMenuOpen ? 'Close' : 'Menu'}
              className="text-foreground!"
            >
              {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" sideOffset={4}>
            {isMenuOpen ? 'Close' : 'Menu'}
          </TooltipContent>
        </Tooltip>
        <Link
          className="flex h-5 items-center no-underline outline-none shadow-none visited:no-underline hover:no-underline focus:no-underline active:no-underline"
          to={mapOverview}
          aria-label="Giga Maps"
        >
          <GigaMapsLogo
            className={cn(
              'h-4! w-auto! max-w-[9rem]!',
              isLight ? '[&_path]:fill-[#161616]!' : '[&_path]:fill-[#f4f4f4]!',
            )}
          />
        </Link>
      </div>
    </div>
  )
}

export default TopMenuBar;
