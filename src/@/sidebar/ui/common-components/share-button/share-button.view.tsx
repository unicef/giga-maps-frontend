import { Share2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/ui/tooltip';

const ShareButton = ({
  handleShareClicked,
}: {
  handleShareClicked: () => void;
}) => {
  const { t } = useTranslation();
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          aria-label={t('share-content')}
          // The ::after inset grows the 32px circle into a 44px touch target.
          className="relative! flex! size-8! shrink-0! cursor-pointer! items-center! justify-center! rounded-full! border-0! bg-pill-bg! p-0! text-on-surface-muted! transition-colors! after:absolute! after:-inset-1.5! hover:text-foreground!"
          data-slot="share-button"
          onClick={handleShareClicked}
          type="button"
        >
          <Share2 className="size-3.5" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" sideOffset={4}>
        {t('share-content')}
      </TooltipContent>
    </Tooltip>
  );
};

export default ShareButton;
