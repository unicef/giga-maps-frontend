import { useStore } from 'effector-react';
import { MouseEvent, PropsWithChildren, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '~/components/ui/button';
import { $theme, gigaThemeList, setTheme, ThemeType } from '~/core/theme.model';
import { cn } from '~/lib/cn';
import { waitFor } from '~/lib/utils';

import { cancelAnimation } from '../../effects/add-layers-utils';
import { styles } from '../../map.constant';
import {
  $isAdminBoundaries,
  $isNavigateByAdminLevel,
  $isTilesAndLables,
  $style,
  changeStyle,
  onEnableAdminBoundaries,
  onEnableNavigateByAdminLevel,
  onEnableTitlesAndLabels,
} from '../../map.model';
import { Style } from '../../map.types';

const mapThemeList = styles.filter(
  (style: string) => !gigaThemeList.includes(style as ThemeType),
);

const themeLabel: Record<string, string> = {
  dark: 'Dark',
  light: 'Light',
};

const mapTypeLabel: Record<string, string> = {
  default: 'Default',
  satellite: 'Satellite',
  street: 'Street view',
};

const radioClassName = 'size-4! shrink-0! cursor-pointer! accent-primary!';

type ThemeSectionProps = PropsWithChildren<{
  title: string;
}>;

const ThemeSection = ({ title, children }: ThemeSectionProps) => (
  <section className="flex! flex-col! gap-3!">
    <h4 className="text-sm! font-normal! leading-5! text-muted-foreground!">
      {title}
    </h4>
    <div className="flex! flex-col! gap-3!">{children}</div>
  </section>
);

type ThemeRadioOptionProps = {
  checked: boolean;
  id: string;
  label: string;
  name: string;
  onChange: () => void;
};

const ThemeRadioOption = ({
  checked,
  id,
  label,
  name,
  onChange,
}: ThemeRadioOptionProps) => (
  <label
    className="flex! cursor-pointer! items-center! gap-3!"
    htmlFor={id}
  >
    <input
      checked={checked}
      className={radioClassName}
      id={id}
      name={name}
      onChange={onChange}
      type="radio"
    />
    <span className="text-sm! font-normal! leading-5! text-foreground!">
      {label}
    </span>
  </label>
);

type ThemeToggleOptionProps = {
  checked: boolean;
  id: string;
  label: string;
  onChange: () => void;
};

const ThemeToggleOption = ({
  checked,
  id,
  label,
  onChange,
}: ThemeToggleOptionProps) => (
  <div className="flex! items-center! justify-between! gap-3!">
    <label
      className="text-sm! font-normal! leading-5! text-foreground!"
      htmlFor={id}
    >
      {label}
    </label>
    <button
      aria-checked={checked}
      aria-labelledby={id}
      className={cn(
        'relative! inline-flex! h-5! w-9! shrink-0! cursor-pointer! rounded-full! border-2! border-transparent! transition-colors!',
        checked ? 'bg-[#42be65]!' : 'bg-muted!',
      )}
      id={id}
      onClick={onChange}
      role="switch"
      type="button"
    >
      <span
        className={cn(
          'pointer-events-none! block! size-4! rounded-full! bg-white! shadow-sm! transition-transform!',
          checked ? 'translate-x-4!' : 'translate-x-0!',
        )}
      />
    </button>
  </div>
);

const ThemePopupContent = ({
  setOpen,
}: PropsWithChildren<{ setOpen: (open: boolean) => void }>) => {
  const { t } = useTranslation();
  const style = useStore($style);
  const theme = useStore($theme);
  const isAdminBoundaries = useStore($isAdminBoundaries);
  const isTilesAndLables = useStore($isTilesAndLables);
  const [gigaTheme, setGigaTheme] = useState(theme);
  const [currentStyle, setCurrentStyle] = useState(style);
  const [currentAdminBoundaries, setCurrentAdminBoundaries] =
    useState(isAdminBoundaries);
  const [currentTitlesAndLabels, setCurrentTitlesAndLabels] =
    useState(isTilesAndLables);
  const defaultMapStyle = gigaThemeList.includes(currentStyle as ThemeType)
    ? 'default'
    : currentStyle;
  const isNavigateByAdminLevel = useStore($isNavigateByAdminLevel);
  const [currentNavigateByAdminLevel, setCurrentNavigateByAdminLevel] =
    useState(isNavigateByAdminLevel);

  const onApply = async (e: MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    setTheme(gigaTheme);
    onEnableAdminBoundaries(currentAdminBoundaries);
    onEnableTitlesAndLabels(currentTitlesAndLabels);
    onEnableNavigateByAdminLevel(currentNavigateByAdminLevel);
    if (currentStyle !== style) {
      cancelAnimation();
      await waitFor(200);
      changeStyle(currentStyle);
    }
  };

  return (
    <div className="flex! h-full! min-h-0! flex-1! flex-col! bg-popover! in-[.accessible]:bg-[#646973]! in-[[data-theme=accessible]]:bg-[#646973]!">
      <div className="px-4! pt-4!">
        <h3 className="text-base! font-medium! leading-6! text-foreground!">
          Settings
        </h3>
      </div>

      <form
        aria-label="layer-theme-form"
        className="flex! min-h-0! flex-1! flex-col! gap-6! overflow-y-auto! px-4! py-4!"
      >
        <ThemeSection title="Theme">
          {gigaThemeList
            .filter((item) => item !== 'accessible')
            .map((item, index) => (
              <ThemeRadioOption
                checked={gigaTheme === item}
                id={`giga_${item}_${index}`}
                key={`giga-${item}`}
                label={themeLabel[item] ?? t(`${item}-mode`)}
                name="theme-radio-button-group-giga"
                onChange={() => {
                  setCurrentStyle(item as Style);
                  setGigaTheme(item as ThemeType);
                }}
              />
            ))}
        </ThemeSection>

        <ThemeSection title="Map type">
          <ThemeRadioOption
            checked={defaultMapStyle === 'default'}
            id="default-view-radio"
            label={mapTypeLabel.default}
            name="theme-radio-button-group"
            onChange={() => {
              setCurrentStyle(gigaTheme);
            }}
          />
          {mapThemeList.map((item, index) => (
            <ThemeRadioOption
              checked={defaultMapStyle === item}
              id={`${item}_${index}`}
              key={item}
              label={mapTypeLabel[item] ?? t(`${item}-view`)}
              name="theme-radio-button-group"
              onChange={() => {
                setCurrentStyle(item as Style);
              }}
            />
          ))}
        </ThemeSection>

        <ThemeSection title="Layers">
          <ThemeToggleOption
            checked={currentAdminBoundaries}
            id="admin-boundary"
            label="Boundaries"
            onChange={() => {
              setCurrentAdminBoundaries((prev) => !prev);
            }}
          />
          <ThemeToggleOption
            checked={currentTitlesAndLabels}
            id="titles-label"
            label="Titles and labels"
            onChange={() => {
              setCurrentTitlesAndLabels((prev) => !prev);
            }}
          />
          <ThemeToggleOption
            checked={currentNavigateByAdminLevel}
            id="navigate-by-admin-level"
            label="Admin levels"
            onChange={() => {
              setCurrentNavigateByAdminLevel((prev) => !prev);
            }}
          />
        </ThemeSection>
      </form>

      <div className="mt-auto! flex! gap-2! px-4! pb-4! pt-2!">
        <Button
          className="h-10! flex-1! rounded-lg!"
          onClick={() => setOpen(false)}
          type="button"
          variant="secondary"
        >
          {t('cancel')}
        </Button>
        <Button
          className="h-10! flex-1! rounded-lg!"
          onClick={(event) => {
            void onApply(event);
          }}
          type="button"
        >
          {t('apply')}
        </Button>
      </div>
    </div>
  );
};

export default ThemePopupContent;
