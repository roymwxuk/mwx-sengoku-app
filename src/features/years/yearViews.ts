export interface YearView {
  year: number
  label: string
  /**
   * Owners often change within a year: show the first or the last of them, or
   * the last before 本能寺.
   */
  at: 'start' | 'honnoji' | 'end'
  /** Explains the moment shown */
  note?: string
}

/** Not kept in the URL */
export const DEFAULT_VIEW: YearView = {
  year: 1582,
  label: '本能寺',
  at: 'honnoji', // 武田氏 had fallen in March
  note: '本能寺の変の直前',
}

/** The years that can be shown. */
export const YEAR_VIEWS: readonly YearView[] = [
  {
    year: 1553,
    label: '川中島',
    at: 'start',
    note: '第一次川中島の戦いの直前',
  },
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
  {
    year: 1614,
    label: '冬の陣',
    at: 'end', // the siege was in the last months
    note: '大坂冬の陣の直前',
  },
]
