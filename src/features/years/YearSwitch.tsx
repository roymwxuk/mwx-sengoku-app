import { useYear } from './yearStore'
import { YEAR_VIEWS } from './yearViews'

export function YearSwitch() {
  const { view, setView } = useYear()

  return (
    <div
      role="group"
      aria-label="年を選ぶ"
      className="absolute top-16 left-3 flex bg-washi/90 shadow-sm min-[28rem]:top-3 min-[28rem]:left-[9.75rem]"
    >
      {YEAR_VIEWS.map((option) => (
        <button
          key={option.year}
          type="button"
          aria-pressed={option === view}
          onClick={() => setView(option)}
          className="h-11 w-[2.875rem] cursor-pointer border-b-4 border-transparent text-[0.8125rem] leading-tight whitespace-nowrap sm:w-[3.25rem] sm:text-sm hover:text-shu focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-shu aria-pressed:border-shu"
        >
          {option.year}年
          <span className="block text-[0.6875rem]">{option.label}</span>
        </button>
      ))}
    </div>
  )
}
