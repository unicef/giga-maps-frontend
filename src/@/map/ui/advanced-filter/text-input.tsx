import { useEffect, useState } from 'react';

import { AdvanceFilterType } from '~/api/types';
import { Input } from '~/components/ui/input';
import { evaluateExpression } from '~/lib/utils';

import { filterControlClassName } from './filter-control-styles';
import { FilterFieldLabel } from './filter-field-label';

const TextField = ({
  value,
  itemKey,
  options,
  column_configuration: parameter,
  name,
  onChange,
  description,
}: AdvanceFilterType & {
  value: string;
  itemKey: string;
  onChange: (key: string, value: string) => void;
}) => {
  const { downcast_aggr_str, upcast_aggr_str } = parameter.options ?? {};
  const [currentValue, setCurrentValue] = useState('');

  useEffect(() => {
    setCurrentValue(
      downcast_aggr_str
        ? (evaluateExpression(downcast_aggr_str, value) as string)
        : value,
    );
  }, [downcast_aggr_str, value]);

  return (
    <div className="flex! flex-col! gap-2! px-4! py-2!">
      <FilterFieldLabel
        description={description}
        htmlFor={`text-input-${parameter.name}`}
        name={name}
      />
      <Input
        className={filterControlClassName}
        id={`text-input-${parameter.name}`}
        onChange={(e) => {
          onChange(
            itemKey,
            upcast_aggr_str
              ? (evaluateExpression(upcast_aggr_str, e.target.value) as string)
              : e.target.value,
          );
        }}
        placeholder={options?.placeholder ?? `Enter ${name}`}
        type="text"
        value={currentValue}
      />
    </div>
  );
};

export default TextField;
