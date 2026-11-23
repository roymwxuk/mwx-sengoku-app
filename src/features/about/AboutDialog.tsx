import { useRef, type ReactNode } from 'react'
import { ExternalLink } from '../../components/ExternalLink'

const GITHUB = 'https://github.com/roymwxuk/mwx-sengoku-app'

/** A button, and the dialog it opens: what the site is, credits and GitHub */
export function AboutDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const close = () => dialogRef.current?.close()

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => dialogRef.current?.showModal()}
        className="h-11 cursor-pointer bg-washi px-4 shadow-md hover:text-shu focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shu"
      >
        概要
      </button>

      <dialog
        ref={dialogRef}
        tabIndex={-1} // so that Esc still comes here after clicking on text
        aria-labelledby="about-title"
        onKeyDown={(event) => event.stopPropagation()} // Esc: not the panel too
        onClick={(event) => {
          if (event.target === event.currentTarget) close() // the backdrop
        }}
        className="m-auto max-h-[calc(100dvh-2rem)] w-[min(34rem,100vw-2rem)] max-w-none overflow-y-auto overscroll-contain border-t-4 border-shu bg-washi text-sumi shadow-lg outline-none backdrop:bg-sumi/50"
      >
        <div className="relative px-5 pt-4 pb-6 leading-relaxed">
          <button
            type="button"
            onClick={close}
            aria-label="閉じる"
            className="absolute top-2 right-2 grid size-11 cursor-pointer place-items-center text-2xl leading-none hover:text-shu focus-visible:outline-2 focus-visible:outline-shu"
          >
            <span aria-hidden="true">×</span>
          </button>

          <h2 id="about-title" className="pr-12 text-2xl tracking-wide">
            戦国城地図について
          </h2>
          <p className="mt-3">
            戦国時代の日本の城を探して調べられる地図です。1553年、1560年、1583年、1600年の城と城主を見比べられます。
          </p>
          <p className="mt-2">
            城のデータは、歴史面での確認がまだ必要です。誤りに気づいたら、GitHubでお知らせください。
          </p>
          <ul className="mt-2 flex flex-wrap gap-x-5">
            <li>
              <ExternalLink href={GITHUB}>GitHub</ExternalLink>
            </li>
            <li>
              <ExternalLink href={`${GITHUB}/issues`}>
                誤りを知らせる
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href={`${GITHUB}/blob/master/docs/data-sources.md`}>
                データの出典（英語）
              </ExternalLink>
            </li>
          </ul>

          <h3 className="mt-3 border-t border-sumi/20 pt-3 text-lg">
            出典とライセンス
          </h3>
          <dl className="mt-1 space-y-2 text-sm">
            <Credit label="城と大名家">
              位置はWikidata（CC0）、名前・種類・年代などの事実は日本語版Wikipediaなどによります。説明文はこのサイトのために書いたものです（MIT）。
            </Credit>
            <Credit label="海岸線と湖">
              Made with Natural Earth（パブリックドメイン）
            </Credit>
            <Credit label="国境">
              『旧国・旧郡境界データセット』（CODH作成）「幕末明治地勢地図境界データ」（人間文化研究機構作成）を加工（CC
              BY-NC 4.0）。商用利用はできません。
            </Credit>
            <Credit label="プログラム">MIT</Credit>
          </dl>
          <ExternalLink href={`${GITHUB}/blob/master/public/data/LICENSE.md`}>
            データのライセンス（英語）
          </ExternalLink>
        </div>
      </dialog>
    </>
  )
}

function Credit({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-shu">{label}</dt>
      <dd>{children}</dd>
    </div>
  )
}
