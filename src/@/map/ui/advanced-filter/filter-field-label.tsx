import { cn } from '~/lib/cn';

import { filterFieldLabelClassName } from './filter-control-styles';
import { FilterTooltip } from './filter-tooltip';

type FilterFieldLabelProps = {
  name: string;
  description?: string;
  htmlFor?: string;
};

export const FilterFieldLabel = ({
  name,
  description,
  htmlFor,
}: FilterFieldLabelProps) => (
  <label className={cn(filterFieldLabelClassName)} htmlFor={htmlFor}>
    {name}
    {!!description && <FilterTooltip label={description} />}
  </label>
);
