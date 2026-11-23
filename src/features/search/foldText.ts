// Spellings of the same name are folded to one form, so that they match.

/** Kanji that are often written in place of one another in castle names */
const KANJI_VARIANTS: Record<string, string> = {
  阪: '坂',
  須: '洲',
  嶋: '島',
  﨑: '崎',
  髙: '高',
  澤: '沢',
  櫻: '桜',
  濱: '浜',
  瀧: '滝',
  廣: '広',
}

const VARIANT = new RegExp(`[${Object.keys(KANJI_VARIANTS).join('')}]`, 'g')

const katakanaToHiragana = (text: string) =>
  text.replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60))

/** Full-width letters, capitals, spaces and punctuation don't matter. */
const simplify = (text: string) =>
  text
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[\s\-'’・.]/g, '')

/** For kanji and kana: オーサカ, おうさか and おおさか are the same. */
export function foldJapanese(text: string): string {
  return katakanaToHiragana(simplify(text))
    .replace(VARIANT, (c) => KANJI_VARIANTS[c])
    .replace(/(?<=\p{Script=Han})[ゖけ](?=\p{Script=Han})/gu, 'が')
    .replace(/づ/g, 'ず')
    .replace(/ぢ/g, 'じ')
    .replace(/ー/g, '')
    .replace(/([おこそとのほもよろをごぞどぼぽょ])[うお]+/g, '$1')
}

/** For romaji: Ōsaka, Oosaka and Ohsaka, or Azuchi and Aduti, are the same. */
export function foldRomaji(text: string): string {
  return simplify(text)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // ō -> o
    .replace(/oh(?![aiueoy])|ou/g, 'o')
    .replace(/sh/g, 's')
    .replace(/ch?|ts/g, 't')
    .replace(/f/g, 'h')
    .replace(/j|dz|d(?=[iu])/g, 'z')
    .replace(/([stz])y/g, '$1')
    .replace(/m(?=[bp])/g, 'n')
    .replace(/(.)\1+/g, '$1')
}
