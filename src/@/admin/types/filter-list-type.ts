
export type FilterAllValueType = {
  code: string
  name: string
  column_configuration: number | string
  type: string
  description: string
  query_param_filter: string
  entity_type: number | string;
  options: {
    placeholder?: string
    live_choices?: boolean
    group_choices?: boolean
    range_auto_compute?: boolean
    choices?: { label: string, value: string }[],
    minPlaceholder?: string
    maxPlaceholder?: string
  }
}

export type FiltereysType = keyof FilterAllValueType;

export type FilterValueType = FilterAllValueType[FiltereysType]