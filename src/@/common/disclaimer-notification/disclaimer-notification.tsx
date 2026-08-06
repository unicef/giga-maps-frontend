import { X } from 'lucide-react';
import { type ReactNode, useEffect, useId } from 'react';

import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { cn } from '~/lib/cn';

type DisclaimerNotificationProps = {
  children: ReactNode;
  className?: string;
  closeLabel: string;
  /** Action row below a divider. Mobile only. */
  footer?: ReactNode;
  /** Glyph for the accent chip. Omit for a text-only card. */
  icon?: ReactNode;
  /** Blocks the page behind a backdrop until dismissed. */
  modal?: boolean;
  onClose?: () => void;
  title: ReactNode;
};

/** Dismissible notification card. Callers own visibility and positioning. */
const DisclaimerNotification = ({
  children,
  className,
  closeLabel,
  footer,
  icon,
  modal = false,
  onClose,
  title,
}: DisclaimerNotificationProps) => {
  const titleId = useId();

  useEffect(() => {
    if (!modal || !onClose) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [modal, onClose]);

  return (
    <>
      {modal ? (
        <button
          aria-label={closeLabel}
          // Above the map controls (6010) and the legend popover portal (10000).
          className="fixed inset-0 z-[10050] bg-black/60"
          onClick={onClose}
          tabIndex={-1}
          type="button"
        />
      ) : null}

      <Card
        aria-labelledby={modal ? titleId : undefined}
        aria-modal={modal || undefined}
        // `!` throughout: Carbon's unlayered CSS outranks Tailwind utilities.
        className={cn(
          'border-border! gap-0! rounded-lg! border! p-0! shadow-xl!',
          'animate-[notification-enter_200ms_ease-out]',
          className,
        )}
        role={modal ? 'dialog' : undefined}
      >
        <div className="flex items-start gap-4! p-4!">
          {icon ? (
            <div className="bg-primary-300 text-primary! flex size-10 shrink-0 items-center justify-center rounded-lg!">
              {icon}
            </div>
          ) : null}

          <div className="flex min-w-0 flex-1 flex-col gap-1.5!">
            <p
              className="text-card-foreground! text-base! leading-6! font-medium!"
              id={titleId}
            >
              {title}
            </p>
            <div className="text-muted-foreground! text-sm! leading-5! break-words">
              {children}
            </div>
          </div>

          {onClose ? (
            <Button
              aria-label={closeLabel}
              className="text-muted-foreground hover:text-foreground -mt-1 -mr-1 shrink-0"
              onClick={onClose}
              size="icon-sm"
              variant="ghost"
            >
              <X className="size-5" />
            </Button>
          ) : null}
        </div>

        {footer ? (
          <div className="border-border! flex items-center justify-end gap-2! border-t! p-4!">
            {footer}
          </div>
        ) : null}
      </Card>
    </>
  );
};

export default DisclaimerNotification;
