import { useStore } from 'effector-react';
import { LayoutGrid } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { EntityType } from '~/@/entities/types/base-entity.type';
import { Button } from '~/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';
import { ScrollArea } from '~/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip';
import { $isMobile } from '~/core/media-query';
import { cn } from '~/lib/cn';

import { $sidebarHeight } from '../../sidebar.model';
import GigaLayerButtonIcons from '../common-components/giga-layer-button-icons';

const CommonComponentGigaLayer = ({
  entityType,
  isCountryView = false,
}: {
  entityType?: EntityType;
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
          'sidebar-footer-gigalayer-container z-1! md:sticky! md:bottom-0! flex! items-start! bg-background! transition-transform! duration-[400ms]! ease-in-out!',
          isCountryView
            ? 'relative! mt-auto! w-full! justify-center! pb-2!'
            : 'fixed! bottom-[1.8rem]! w-[inherit]! justify-between! border-t! border-secondary! max-md:bottom-0! max-md:w-full!',
          isMobile && !sidebarHeight && !isCountryView && 'translate-y-full!',
        )}
      >
        <div
          className={
            'sidebar-footer-gigalayer-icons-container flex! w-full! min-w-0! flex-row! items-center! gap-2! overflow-hidden! p-2!'
          }
        >
          <div className="min-w-0! flex-1! overflow-hidden!">
            <GigaLayerButtonIcons entityType={entityType} />
          </div>
          <Popover open={modalOpen} onOpenChange={setModalOpen}>
            <Tooltip>
              <TooltipTrigger asChild>
                <PopoverTrigger asChild>
                  <Button
                    aria-label={t('show-more')}
                    className={cn(
                      'sidebar-worldview-gigaIcon flex! h-[4.25rem]! w-8! min-w-8! items-center! rounded-md! p-0!',
                      modalOpen
                        ? 'bg-primary! text-primary-foreground! hover:bg-primary! hover:text-primary-foreground!'
                        : 'text-muted-foreground! hover:bg-transparent! hover:text-foreground!',
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
              align="center"
              className="sidebar-footer-gigalayer-icons-popover z-50! w-[17.25rem]! max-w-[calc(100vw-1rem)]! overflow-hidden! rounded-lg! border! border-[#393939]! bg-[#161616]! px-2.5! py-4! text-[#f4f4f4]! shadow-[0_1px_2px_0_rgb(0_0_0/0.05)]!"
              onCloseAutoFocus={(event) => event.preventDefault()}
              side={isMobile ? 'top' : 'right'}
              sideOffset={20}
            >
              <ScrollArea
                className="w-[calc(100%+0.625rem)]!"
                style={{ height: 'min(24.5rem, calc(100vh - 8rem))' }}
                viewportClassName="h-full! pr-2.5!"
              >
                <GigaLayerButtonIcons entityType={entityType} popup={true} />
              </ScrollArea>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default CommonComponentGigaLayer;
