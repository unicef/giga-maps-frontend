import { Share2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '~/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip';

type LandingPageHeaderProps = {
  onShareClicked: () => void;
  subtitle: string;
  title: string;
};

const LandingPageHeader = ({ onShareClicked, subtitle, title }: LandingPageHeaderProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex! flex-col! gap-1!">
      <div className="flex! items-start! justify-between! gap-1!">
        <p className="m-0! max-w-56! font-manrope! text-2xl! font-extralight! leading-[36px]! text-foreground!">
          {t(title)}
        </p>
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
          <TooltipContent side="bottom" sideOffset={4}>
            {t('share-content')}
          </TooltipContent>
        </Tooltip>
      </div>
      <p className="m-0! text-xs! font-normal! leading-4.5! tracking-[0.01rem]! text-muted-foreground!">
        {t(subtitle)}
      </p>
    </div>
  );
};

export default LandingPageHeader;
