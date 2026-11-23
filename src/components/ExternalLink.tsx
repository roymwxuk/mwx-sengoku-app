export function ExternalLink({
  href,
  children,
}: {
  href: string
  children: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex min-h-11 items-center gap-1 text-[0.6875rem] text-shu underline underline-offset-4 hover:text-sumi focus-visible:outline-2 focus-visible:outline-shu"
    >
      {children}
      <span aria-hidden="true">↗</span>
      <span className="sr-only">（新しいタブで開く）</span>
    </a>
  )
}
