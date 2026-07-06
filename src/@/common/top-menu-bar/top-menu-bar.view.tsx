import { Menu, X } from 'lucide-react';

import AtlasLogo from '~/assets/images/atlas-logo.png';
import { Button } from '~/components/ui/button';
import { mapOverview } from '~/core/routes';
import { Link } from '~/lib/router';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip';
import { useStore } from 'effector-react';
import logo from '~/assets/images/giga-logo.png';
import whiteLogo from '~/assets/images/white-logo-small.png';
import { $theme, ThemeType } from '~/core/theme.model';

const TopMenuBar = ({
  isMenuOpen = false,
  onClickMenu = () => { }
}: { isMenuOpen?: boolean; onClickMenu?: () => void; }) => {
  const isLight = useStore($theme) === ThemeType.light;
  return (
    <div
      className="flex w-full items-center justify-between border-b border-white/8 text-foreground! [&_.cds--btn--ghost]:!bg-transparent [&_.cds--btn--ghost:hover]:!bg-transparent [&_.cds--btn--ghost:active]:!bg-transparent [&_.cds--btn--ghost:focus]:!bg-transparent [&_.cds--btn--icon-only]:!flex [&_.cds--btn--icon-only]:!min-h-8 [&_.cds--btn--icon-only]:!min-w-8 [&_.cds--btn--icon-only]:!items-center [&_.cds--btn--icon-only]:!justify-center [&_.cds--btn--icon-only]:!p-0 [&_.cds--popover-caret]:!bg-current [&_.cds--tooltip-content]:!bg-current [&_svg]:!fill-[#f4f4f4]"
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
            >
              {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" sideOffset={4}>
            {isMenuOpen ? 'Close' : 'Menu'}
          </TooltipContent>
        </Tooltip>
        <Link
          className="flex h-3 items-center no-underline outline-none shadow-none visited:no-underline hover:no-underline focus:no-underline active:no-underline"
          to={mapOverview}
        >
          <img src={isLight ? whiteLogo : logo} className='h-4 w-auto' alt="Giga logo" />
        </Link>
      </div>
    </div>
  )
}

export default TopMenuBar;