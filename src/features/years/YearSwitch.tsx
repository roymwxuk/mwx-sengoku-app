import { useYear } from './yearStore'
import { YEAR_VIEWS } from './yearViews'

export function YearSwitch() {
  const { view, setView } = useYear()

  return (
    <div
      role="group"
      aria-label="年を選ぶ"
      className="absolute top-16 left-3 flex bg-washi/90 shadow-sm min-[22.5rem]:top-3 min-[22.5rem]:left-[9.75rem]"
    >
      {YEAR_VIEWS.map((option) => (
        <button
          key={option.year}
          type="button"
          aria-pressed={option === view}
          onClick={() => setView(option)}
          className="h-11 w-[3.25rem] cursor-pointer border-b-4 border-transparent text-sm leading-tight hover:text-shu focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-shu aria-pressed:border-shu"
        >
          {option.year}年
          <span className="block text-[0.6875rem]">{option.label}</span>
        </button>
      ))}
    </div>
  )
}
