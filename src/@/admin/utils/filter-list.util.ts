import { FilterStatusType } from "../types/filter-list.type";


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
