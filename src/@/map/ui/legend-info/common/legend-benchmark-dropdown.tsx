import { useStore } from 'effector-react';
import { ChevronDown } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  $countryActiveLayersDataById,
  $countryBenchmark,
  $countryConnectivityNames,
} from '~/@/country/country.model';
import { ConnectivityBenchMarks } from '~/@/sidebar/sidebar.constant';
import {
  $benchmarkNamesAllLayers,
  $connectivityBenchMark,
  $layerUtils,
  changeConnectivityBenchmark,
} from '~/@/sidebar/sidebar.model';
import { Popover, PopoverAnchor, PopoverContent } from '~/components/ui/popover';
import { cn } from '~/lib/cn';

type LegendBenchmarkDropdownProps = {
  interactive: boolean;
  title?: string;
  valueLabel?: string;
};

const SelectedOptionIcon = () => (
  <svg
    aria-hidden="true"
    className="block!"
    fill="none"
    height="12"
    viewBox="0 0 12 12"
    width="12"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M2.5 6.25L4.75 8.5L9.5 3.75" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
  </svg>
);

const LegendBenchmarkDropdown = ({
  interactive,
  title,
  valueLabel,
}: LegendBenchmarkDropdownProps) => {
  const { t } = useTranslation();
  const { selectedLayerId } = useStore($layerUtils);
  const benchmarkNames = useStore($benchmarkNamesAllLayers);
  const connectivityBenchMark = useStore($connectivityBenchMark);
  const countryConnectivityNames = useStore($countryConnectivityNames);
  const countryBenchmark = useStore($countryBenchmark);
  const countryActiveLayersDataById = useStore($countryActiveLayersDataById);
  const [open, setOpen] = useState(false);

  const layerId = selectedLayerId ?? 0;
  const currentLegendConfig = (countryActiveLayersDataById[layerId]?.legend_configs ?? {}) as Record<string, unknown>;
  const isCountryNationalBenchmark = !!countryBenchmark[layerId] || Object.keys(currentLegendConfig).length > 0;
  const globalLabel = benchmarkNames[layerId] ?? t('global-benchmark');
  const nationalLabel = countryConnectivityNames?.[layerId] ?? t('national');

  const options = useMemo(
    () => [
      { disabled: false, label: globalLabel, value: ConnectivityBenchMarks.global },
      { disabled: !isCountryNationalBenchmark, label: nationalLabel, value: ConnectivityBenchMarks.national },
    ],
    [globalLabel, isCountryNationalBenchmark, nationalLabel]
  );

  const selectedValue = connectivityBenchMark === ConnectivityBenchMarks.national && isCountryNationalBenchmark
    ? ConnectivityBenchMarks.national
    : ConnectivityBenchMarks.global;
  const selectedLabel = selectedValue === ConnectivityBenchMarks.national ? nationalLabel : globalLabel;
  const triggerLabel = valueLabel ? `${selectedLabel}: ${valueLabel}` : selectedLabel;


  const handleSelect = (nextValue: ConnectivityBenchMarks, disabled: boolean) => {
    if (disabled) return;
    changeConnectivityBenchmark(nextValue);
    setOpen(false);
  };

  if (!interactive) {
    return (
      <div
        className="mt-1! inline-flex! max-w-full! rounded-md! border! border-border! px-2.5! py-0.5! text-left! text-xs! leading-4.5! text-muted-foreground! whitespace-nowrap!"
        title={title}
      >
        {triggerLabel} 20Mbps
      </div>
    );
  }

  return (
    <Popover modal={false} onOpenChange={setOpen} open={open}>
      <PopoverAnchor asChild>
        <div className="relative! mt-3! inline-flex! max-w-full! flex-col! items-start! gap-1.5!">
          <button
            className="inline-flex! max-w-full! items-center! justify-between! gap-1.5! rounded-md! border! border-border! bg-transparent! px-2.5! py-0.5! text-xs! leading-4.5! text-foreground!"
            onClick={() => setOpen((current) => !current)}
            title={title}
            type="button"
          >
            <span className="truncate! whitespace-nowrap!">{triggerLabel}</span>
            <ChevronDown size={12} />
          </button>
        </div>
      </PopoverAnchor>
      <PopoverContent
        align="start"
        className="z-6004! w-[min(16rem,calc(100vw-2rem))]! rounded-md! border! border-border! bg-popover! p-1! shadow-[0_8px_24px_0_rgb(0_0_0/0.22)]!"
        side="top"
        sideOffset={6}
      >
        <div
          className="flex! flex-col! gap-1! rounded-[calc(0.375rem-2px)]! bg-transparent!"
        >
          {options.map((option) => {
            const isSelected = selectedValue === option.value;

            return (
              <button
                className={cn(
                  'flex! w-full! items-center! justify-between! gap-2! rounded-md! border-0! px-2.5! py-2! text-left! text-xs! leading-4.5!',
                  option.disabled
                    ? 'cursor-not-allowed! opacity-55! text-muted-foreground!'
                    : cn('cursor-pointer! hover:bg-white/8!', isSelected ? 'bg-accent! text-accent-foreground!' : 'text-foreground!')
                )}
                disabled={option.disabled}
                key={option.value}
                onClick={() => handleSelect(option.value, option.disabled)}
                type="button"
              >
                <span className="min-w-0! truncate!">{option.label}</span>
                {isSelected ? <SelectedOptionIcon /> : <span className="h-3! w-3!" />}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LegendBenchmarkDropdown;
