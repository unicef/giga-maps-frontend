import { Close, Menu } from '@carbon/icons-react';
import { IconButton } from '@carbon/react';
import { useTheme } from 'styled-components';

import AtlasLogo from '~/assets/images/atlas-logo.png';
import { mapOverview } from '~/core/routes';
import { Link } from '~/lib/router';

const TopMenuBar = ({
  isMenuOpen = false,
  onClickMenu = () => { }
}: { isMenuOpen?: boolean; onClickMenu?: () => void; }) => {
  const theme = useTheme();

  return (
    <div
      className="flex w-full items-center justify-between border-b border-white/8 bg-[#161616] [&_.cds--btn--ghost]:!bg-transparent [&_.cds--btn--ghost:hover]:!bg-transparent [&_.cds--btn--ghost:active]:!bg-transparent [&_.cds--btn--ghost:focus]:!bg-transparent [&_.cds--btn--icon-only]:!flex [&_.cds--btn--icon-only]:!min-h-8 [&_.cds--btn--icon-only]:!min-w-8 [&_.cds--btn--icon-only]:!items-center [&_.cds--btn--icon-only]:!justify-center [&_.cds--btn--icon-only]:!p-0 [&_.cds--popover-caret]:!bg-current [&_.cds--tooltip-content]:!bg-current [&_svg]:!fill-[#f4f4f4]"
      style={{ color: theme.text }}
    >
      <div className="flex h-11 w-full items-center justify-start gap-2 !px-3.5 py-0">
        <IconButton
          label={isMenuOpen ? "Close" : "Menu"}
          onClick={() => {
            onClickMenu();
          }}
          size="lg"
          align="bottom"
          iconDescription='Menu Icon'
          kind="ghost"
          className="sidebar-menuIcon"
        >
          {isMenuOpen ? <Close size={20} /> : <Menu size={20} />}
        </IconButton>
        <Link
          className="flex h-5 items-center no-underline outline-none shadow-none visited:no-underline hover:no-underline focus:no-underline active:no-underline"
          to={mapOverview}
        >
          <img alt="Atlas" className="block h-auto !w-[48px]" src={AtlasLogo} />
        </Link>
      </div>
    </div>
  )
}

export default TopMenuBar;
