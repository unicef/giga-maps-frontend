import { useStore } from 'effector-react';
import { Loader2, Pause, Play, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { $country } from '~/@/country/country.model';
import {
  $isLoadingTimeplayer,
  $isPauseTimeplayer,
  $timePlayerCurrentYear,
  onPausePlayTimeplayer,
  onToggleTimeplayer,
} from '~/@/sidebar/sidebar.model';
import { Button } from '~/components/ui/button';
import { $isMobile } from '~/core/media-query';
import { cn } from '~/lib/cn';

export const TimeplayerContainer = () => {
  const { t } = useTranslation();
  const timePlayerCurrentYear = useStore($timePlayerCurrentYear);
  const isPauseTimeplayer = useStore($isPauseTimeplayer);
  const isLoading = useStore($isLoadingTimeplayer);
  const country = useStore($country);
  const isMobile = useStore($isMobile);

  return (
    <div className="pointer-events-none fixed inset-0 z-2">
      {isLoading && (
        <div className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs">
          <Loader2 className="h-10! w-10! animate-spin! text-primary!" />
        </div>
      )}

      {!!timePlayerCurrentYear && (
        <div className="pointer-events-auto absolute bottom-36! right-2! flex items-center justify-center gap-4! text-foreground!">
          <div className="flex flex-col items-end text-right">
            <p
              className={cn(
                'm-0! font-medium! leading-tight!',
                isMobile ? 'text-base!' : 'text-xl!',
              )}
            >
              {t('real-time-connectivity-time-player')}
            </p>
            <p
              className={cn(
                'm-0! font-medium! leading-tight! text-muted-foreground!',
                isMobile ? 'text-base!' : 'text-xl!',
              )}
            >
              {country?.name}
            </p>
            <p
              className={cn(
                'm-0! font-bold! leading-tight! text-primary!',
                isMobile ? 'text-base!' : 'text-xl!',
              )}
            >
              {timePlayerCurrentYear}
            </p>
          </div>

          <div className="flex flex-col items-center gap-1.5!">
            <Button
              size="icon"
              variant="secondary"
              className="h-8! w-8! rounded-full! shadow-md! pointer-events-none cursor-default"
              aria-label="..."
            >
              <Loader2 className="h-4! w-4! animate-spin! text-muted-foreground!" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-8! w-8! rounded-full! shadow-md! hover:bg-secondary/80!"
              aria-label={
                isPauseTimeplayer
                  ? t('play', { defaultValue: 'Play' })
                  : t('pause', { defaultValue: 'Pause' })
              }
              title={isPauseTimeplayer ? 'Play' : 'Pause'}
              onClick={() => onPausePlayTimeplayer(!isPauseTimeplayer)}
            >
              {isPauseTimeplayer ? (
                <Play className="h-4! w-4! fill-current" />
              ) : (
                <Pause className="h-4! w-4! fill-current" />
              )}
            </Button>
          </div>
        </div>
      )}

      <div
        className={cn(
          'pointer-events-auto absolute right-2! z-6000!',
          isMobile ? 'top-[3.4rem]!' : 'top-4!',
        )}
      >
        <Button
          size="icon"
          variant="secondary"
          className="h-8! w-8! rounded-full! shadow-md! hover:bg-secondary/80!"
          title="Close timeplayer"
          data-testid="time-player-close"
          aria-label={t('close', { defaultValue: 'Close' })}
          onClick={() => {
            onToggleTimeplayer(false);
          }}
        >
          <X className="h-4! w-4!" />
        </Button>
      </div>
    </div>
  );
};