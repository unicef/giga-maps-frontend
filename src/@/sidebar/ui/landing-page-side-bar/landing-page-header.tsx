import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import DisclaimerPopover from '~/@/common/disclaimer-popover';
import ShareButton from '~/@/sidebar/ui/common-components/share-button';

type LandingPageHeaderProps = {
  onShareClicked: () => void;
  subtitle: string;
  title: string;
};

const LandingPageHeader = ({
  onShareClicked,
  subtitle,
  title,
}: LandingPageHeaderProps) => {
  const { t } = useTranslation();
  const [isAboutDataOpen, setIsAboutDataOpen] = useState(false);
  return (
    <div className="flex! flex-col! gap-1!">
      <div className="flex! items-start! justify-between! gap-1!">
        <p className="m-0! text-xl! text-foreground!">{t(title)}</p>
        <ShareButton handleShareClicked={onShareClicked} />
      </div>
      <DisclaimerPopover
        content={t('about-our-data-description')}
        onOpenChange={setIsAboutDataOpen}
        open={isAboutDataOpen}
        title={t('about-our-data')}
      >
        <p className="m-0! text-xs! font-normal! leading-4.5! tracking-[0.01rem]! text-muted-foreground!">
          {t(subtitle)}{' '}
          <button
            aria-expanded={isAboutDataOpen}
            className="inline! cursor-pointer! border-0! bg-transparent! p-0! text-xs! font-medium! text-primary! underline-offset-2! hover:underline!"
            onClick={() => setIsAboutDataOpen((current) => !current)}
            type="button"
          >
            {t('about-our-data')}
          </button>
        </p>
      </DisclaimerPopover>
    </div>
  );
};

export default LandingPageHeader;
