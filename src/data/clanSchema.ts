import { z } from 'zod'

// Schema for public/data/clans.json (ADR-0005).

const clan = z.strictObject({
  id: z.string().regex(/^[a-z]+(-[a-z]+)*$/),
  name_ja: z.string().min(1),
  reading: z.string().regex(/^[ぁ-んー・]+$/, 'must be hiragana'),
  name_en: z.string().min(1),
  /** One kanji drawn on the castle, so clans aren't told apart by colour only */
  mark: z.string().length(1),
  /** One of scripts/clan-palette.json */
  color: z.string().regex(/^#[0-9a-f]{6}$/),
  /** Article title on Japanese Wikipedia */
  wikipedia_ja: z.string().min(1).optional(),
})

const isUnique = (values: string[]) => new Set(values).size === values.length

export const clanList = z
  .array(clan)
  .min(1)
  .refine((list) => isUnique(list.map((c) => c.id)), 'duplicate id')
  .refine((list) => isUnique(list.map((c) => c.mark)), 'duplicate mark')
  .refine((list) => isUnique(list.map((c) => c.color)), 'duplicate color')

export type Clan = z.infer<typeof clan>
