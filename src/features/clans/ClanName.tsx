import type { Clan } from '../../data/clanSchema'
import { wikipediaUrl } from '../castles/castleLinks'

/** The clan's name, linked to its Wikipedia article if there is one */
export function ClanName({ clan }: { clan: Clan }) {
  if (!clan.wikipedia_ja) return clan.name_ja
  return (
    <a
      href={wikipediaUrl(clan.wikipedia_ja)}
      target="_blank"
      rel="noreferrer"
      className="relative underline underline-offset-4 hover:text-shu focus-visible:outline-2 focus-visible:outline-shu"
    >
      {clan.name_ja}
      <span className="sr-only">（Wikipedia、新しいタブで開く）</span>
    </a>
  )
}
