/* eslint-disable @typescript-eslint/unbound-method */
import { format, Interval, Locale } from 'date-fns';
import i18next from 'i18next';
import { enUS, es as esES, pt } from 'date-fns/locale';
import { humanFormat } from '~/lib/human-format';

const numberLocale = 'en-US';

const dateLocales: { [key: string]: Locale } = {
  en: enUS,
  es: esES,
  pt
  // Add more locales as needed
};

export const formatPercent = new Intl.NumberFormat(numberLocale, {
  style: 'percent',
  maximumFractionDigits: 2,
  useGrouping: false,
}).format;

export const formatNumber = new Intl.NumberFormat(numberLocale).format;

export const formatWeekInterval = ({ start, end }: Interval): string => {
  try {
    const currentLang = i18next.language?.split('-')[0] || 'en';
    const locale = dateLocales[currentLang] || dateLocales.en;
    const startStr = format(start, 'dd', { locale });
    const endStr = format(end, 'dd MMM yyyy', { locale });
    return `${startStr}-${endStr}`;
  } catch (e) {
    console.log({ start, end }, e);
  }
  return '';
}

export const formatConnectionSpeed = (speed: number): string =>
  humanFormat(speed, {
    unit: 'b/s',
    separator: ' ',
  });
