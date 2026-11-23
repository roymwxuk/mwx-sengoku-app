export interface YearView {
  year: number
  label: string
  /** Owners often change within a year: show the first or the last of them. */
  at: 'start' | 'end'
  /** Explains the moment shown */
  note?: string
}

/** Not kept in the URL */
export const DEFAULT_VIEW: YearView = {
  year: 1583,
  label: '天正11年',
  at: 'end',
}

/** The years that can be shown until the timeline exists (M5). */
export const YEAR_VIEWS: readonly YearView[] = [
  {
    year: 1560,
    label: '桶狭間',
    at: 'start',
    note: '桶狭間の戦いの直前',
  },
  DEFAULT_VIEW,
  {
    year: 1600,
    label: '関ヶ原',
    at: 'start',
    note: '関ヶ原の戦いの直前',
  },
]
