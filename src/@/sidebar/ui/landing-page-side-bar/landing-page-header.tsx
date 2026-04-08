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
    <div className="!flex !flex-col !gap-3">
      <div className="!flex !items-start !justify-between !gap-3">
        <p className="!m-0 !max-w-56 !font-['Open_Sans'] !text-[1.5rem] !font-normal !leading-[2.25rem] !tracking-[0] !text-foreground">
          {title}
        </p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label={t('share-content')}
                className="!-mt-0.5 !h-8 !w-8 !rounded-md !bg-transparent !p-0 !text-foreground hover:!bg-accent/30 hover:!text-foreground"
                onClick={onShareClicked}
                type="button"
                variant="ghost"
              >
                <Share2 size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={6}>
              {t('share-content')}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <p className="!m-0 !text-[0.8125rem] !font-normal !leading-[1.125rem] !tracking-[0.01rem] !text-muted-foreground">
        {subtitle}
      </p>
    </div>
  );
};

export default LandingPageHeader;
