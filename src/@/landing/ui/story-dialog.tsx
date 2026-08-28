import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';

import { LANDING_COPY } from '../landing.constant';
import { StoryData } from '../landing.types';

interface StoryDialogProps {
  onOpenChange: (open: boolean) => void;
  story: StoryData | null;
}

// `story` doubles as the open flag: Radix unmounts the content on close anyway,
// so keeping a closed copy around would only be for the exit animation.
export const StoryDialog = ({ onOpenChange, story }: StoryDialogProps) => {
  if (!story) return null;

  return (
    <Dialog onOpenChange={onOpenChange} open={true}>
      <DialogContent className="flex! max-h-[min(400px,70dvh)]! flex-col! gap-0! overflow-hidden! border-border! bg-background! p-6! text-foreground! tablet:max-h-[85dvh]! tablet:max-w-[37.5rem]!">
        <DialogHeader className="shrink-0! pr-8!">
          {/* A story only needs a title or a body, so the heading Radix
              requires is not always something worth showing. */}
          <DialogTitle
            className={
              story.title
                ? 'text-left! font-manrope! text-xl! leading-[1.875rem]! font-medium! text-foreground!'
                : 'sr-only'
            }
          >
            {story.title || LANDING_COPY.storyTitleFallback}
          </DialogTitle>
        </DialogHeader>

        {story.body ? (
          <div className="mt-2! min-h-0! flex-1! overflow-y-auto!">
            <DialogDescription className="m-0! text-base! leading-6! whitespace-pre-line! text-foreground!">
              {story.body}
            </DialogDescription>
          </div>
        ) : null}

        {story.ctaLink ? (
          <a
            className="mt-6! shrink-0! self-start! text-sm! font-medium! text-primary! transition-colors hover:text-primary/80!"
            href={story.ctaLink}
            rel="noreferrer"
            target="_blank"
          >
            {LANDING_COPY.readStory}
          </a>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
