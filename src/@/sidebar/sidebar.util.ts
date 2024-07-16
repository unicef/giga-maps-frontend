import { LayerTypeChoices } from "./types"

export const isLiveLayer = (type?: LayerTypeChoices) => {
  return (type && type === LayerTypeChoices.LIVE) ?? false
}

export const isStaticLayer = (type?: LayerTypeChoices) => {
  return (type && type === LayerTypeChoices.STATIC) ?? false
}


export const createHistoryIntervalFormat = (startEndDate?: { start_date: string; end_date: string }) => {
  if (!startEndDate) return null;
  const { start_date: startDate, end_date: endDate } = startEndDate;
  const start = startDate.split('-')
  const end = endDate.split('-')
  return {
    start: new Date(Number(start[2]), Number(start[1]) - 1, Number(start[0])),
    end: new Date(Number(end[2]), Number(end[1]) - 1, Number(end[0]))
  }
}