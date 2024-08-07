import { FilterOptionsField, FilterStatusType } from "../types/filter-list.type";


export const getFilterStatus = (status?: FilterStatusType | string) => ({
  isActivated: status === FilterStatusType.PUBLISHED,
  isDisabled: status === FilterStatusType.DISABLED,
  inDraft: status === FilterStatusType.DRAFT,
})

export const getFilterType = (type?: string) => ({
  isDropdown: type === 'DROPDOWN' || type === 'DROPDOWN_MULTISELECT',
  isRange: type === 'RANGE',
  isInput: type === 'INPUT',
  isBoolean: type === 'BOOLEAN'
})

export const FilterStatusColors = {
  DRAFT: "#CDD3DA",
  PUBLISHED: "#B9EFCB",
  DISABLED: "#FFD7D9",
} as Record<string, string>


export const cleanOptionFields = (options: FilterOptionsField, type: string) => {
  if (type === 'DROPDOWN' || type === 'DROPDOWN_MULTISELECT') {
    delete options.auto_compute
    delete options.minPlaceholder
    delete options.maxPlaceholder
  } else if (type === 'RANGE') {
    delete options.choices;
    delete options.live_choices;
    delete options.placeholder;
  } else if (type === 'INPUT' || type === 'BOOLEAN') {
    delete options.choices;
    delete options.live_choices;
    delete options.auto_compute
    delete options.minPlaceholder
    delete options.maxPlaceholder
  }

  return options;
}