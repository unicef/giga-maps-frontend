import type { ButtonHTMLAttributes, CSSProperties, PropsWithChildren } from 'react';
import { useTheme } from 'styled-components';

import { cn } from '~/lib/cn';

type MapControlButtonProps = PropsWithChildren<{
  active?: boolean;
  buttonClassName?: string;
  containerClassName?: string;
  label: string;
}> & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>;

const MapControlButton = ({
  active = false,
  buttonClassName,
  children,
  className,
  containerClassName,
  label,
  type = 'button',
  ...props
}: MapControlButtonProps) => {
  const theme = useTheme();
  const style = {
    '--map-control-bg': active ? theme.titleBlue : theme.main,
    '--map-control-border': active ? theme.titleBlue : theme.main,
    '--map-control-icon': active ? '#f4f4f4' : theme.text,
    '--map-control-tooltip-bg': theme.text,
    '--map-control-tooltip-text': theme.main,
  } as CSSProperties;

  return (
    <div className={cn('group !relative !z-[6010] !mt-2 !flex !overflow-visible', containerClassName)} style={style}>
      <button
        {...props}
        className={cn(
          '!relative !inline-flex !h-8 !w-8 !cursor-pointer !items-center !justify-center !rounded-full !border !border-[color:var(--map-control-border)] !bg-[color:var(--map-control-bg)] !px-1 !py-0.5 !text-[color:var(--map-control-icon)] !transition-colors focus:!outline-none',
          buttonClassName,
          className
        )}
        type={type}
      >
        {children}
      </button>
      <div className="!pointer-events-none !absolute !right-[calc(100%+0.75rem)] !top-1/2 !z-[6006] !-translate-y-1/2 !opacity-0 !transition-opacity group-hover:!opacity-100 group-focus-within:!opacity-100">
        <div className="!relative !whitespace-nowrap !rounded !bg-[color:var(--map-control-tooltip-bg)] !px-3 !py-1.5 !text-xs !leading-4 !text-[color:var(--map-control-tooltip-text)]">
          {label}
          <span className="!absolute !left-full !top-1/2 !-translate-y-1/2 !border-y-[6px] !border-y-transparent !border-l-[6px] !border-l-[color:var(--map-control-tooltip-bg)]" />
        </div>
      </div>
    </div>
  );
};

export default MapControlButton;
