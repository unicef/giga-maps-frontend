import { useStore } from 'effector-react';
import { LayoutGrid } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Scroll } from '~/@/scroll';
import { Button } from '~/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip';
import { $isMobile } from '~/core/media-query';
import { cn } from '~/lib/cn';

import { $sidebarHeight } from '../../sidebar.model';
import GigaLayerButtonIcons from './giga-layer-button-icons';

const CommonComponentGigaLayer = ({
  isCountryView = false,
}: {
  isCountryView?: boolean;
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const sidebarHeight = useStore($sidebarHeight);
  const isMobile = useStore($isMobile);
  const { t } = useTranslation();
  return (
    <TooltipProvider>
      <div
        className={cn(
          'sidebar-footer-gigalayer-container z-1! flex! items-start! bg-background! transition-transform! duration-[400ms]! ease-in-out!',
          isCountryView
            ? 'relative! w-full! justify-center! bg-transparent!'
            : 'fixed! bottom-[1.8rem]! w-[inherit]! justify-between! border-t! border-secondary! max-md:bottom-0! max-md:w-full!',
          isMobile && !sidebarHeight && !isCountryView && 'translate-y-full!',
        )}
      >
        <div
          className={cn(
            'sidebar-footer-gigalayer-icons-container flex! flex-row! items-center! pr-0!',
            isCountryView ? 'p-[0.4rem]! scale-90!' : 'p-2!',
          )}
        >
          <GigaLayerButtonIcons />
          <Popover open={modalOpen} onOpenChange={setModalOpen}>
            <Tooltip>
              <TooltipTrigger asChild>
                <PopoverTrigger asChild>
                  <Button
                    aria-label={t('show-more')}
                    className={cn(
                      'sidebar-worldview-gigaIcon flex! items-center! p-0! text-muted-foreground! hover:bg-transparent! hover:text-foreground!',
                      isCountryView && 'scale-90!',
                    )}
                    size="icon-sm"
                    type="button"
                    variant="ghost"
                  >
                    <LayoutGrid
                      className={cn('size-4!', isCountryView && 'size-3.5!')}
                    />
                  </Button>
                </PopoverTrigger>
              </TooltipTrigger>
              <TooltipContent align="end" side="top" sideOffset={4}>
                {t('show-more')}
              </TooltipContent>
            </Tooltip>
            <PopoverContent
              align="end"
              className="sidebar-footer-gigalayer-icons-popover z-50! h-[13rem]! w-[19rem]! border! border-border! bg-popover! p-4! text-popover-foreground! shadow-md! max-md:max-h-[25rem]! max-md:overflow-y-auto! max-md:p-2! max-md:pl-4!"
              onCloseAutoFocus={(event) => event.preventDefault()}
              side={isMobile ? 'top' : 'right'}
              sideOffset={4}
            >
              <Scroll className="max-h-[11rem]!">
                <GigaLayerButtonIcons popup={true} />
              </Scroll>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default CommonComponentGigaLayer;
