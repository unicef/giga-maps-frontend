import { Share2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '~/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';

type LandingPageHeaderProps = {
  onShareClicked: () => void;
  subtitle: string;
  title: string;
};

const LandingPageHeader = ({ onShareClicked, subtitle, title }: LandingPageHeaderProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex! flex-col! gap-3!">
      <div className="flex! items-start! justify-between! gap-3!">
        <p className="m-0! max-w-56! text-2xl! font-light! leading-7.5! text-foreground!">
          {t(title)}
        </p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label={t('share-content')}
                onClick={onShareClicked}
                type="button"
                variant="icon"
                size="icon"
                className="text-foreground!"
              >
                <Share2 className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={6}>
              {t('share-content')}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <p className="m-0! text-xs! font-normal! leading-4.5! tracking-[0.01rem]! text-muted-foreground!">
        {t(subtitle)}
      </p>
    </div>
  );
};

export default LandingPageHeader;
