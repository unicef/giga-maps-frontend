import { X } from 'lucide-react';
import { type ReactNode } from 'react';

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
  onClose,
  title,
}: DisclaimerNotificationProps) => (
  <Card
    // `!` throughout: Carbon's unlayered CSS outranks Tailwind utilities.
    className={cn(
      'border-border! gap-0! rounded-lg! border! p-0! shadow-xl!',
      'animate-[notification-enter_200ms_ease-out]',
      className,
    )}
  >
    <div className="flex items-start gap-4! p-4!">
      {icon ? (
        <div className="bg-primary-300 text-primary! flex size-10 shrink-0 items-center justify-center rounded-lg!">
          {icon}
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col gap-1.5!">
        <p className="text-card-foreground! text-base! leading-6! font-medium!">
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
);

export default DisclaimerNotification;
