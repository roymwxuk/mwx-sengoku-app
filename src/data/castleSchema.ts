import { z } from 'zod'

// Schema for public/data/castles.geojson (ADR-0005). Used by `npm run
// data:check`; the app imports only its types, so Zod isn't bundled.

const year = z.int().min(500).max(2000)

/** Sources often disagree or are vague. A certain year has equal ends. */
const yearRange = z
  .strictObject({ earliest: year, latest: year })
  .refine((r) => r.earliest <= r.latest, 'earliest is after latest')

const name = {
  name_ja: z.string().min(1),
  reading: z.string().regex(/^[ぁ-んー]+$/, 'must be hiragana'),
  name_en: z.string().min(1),
}

const formerName = z.strictObject({ ...name, until: year.nullable() })

const owner = z
  .strictObject({
    clan: z.string().min(1),
    from: year,
    to: year.nullable(),
    /** Came in after 本能寺 (2 June 1582), so isn't in the 1582 view */
    after_honnoji: z.literal(true).optional(),
  })
  .refine((o) => o.to === null || o.from <= o.to, 'from is after to')
  .refine(
    (o) => !o.after_honnoji || o.from === 1582,
    'after_honnoji is for 1582',
  )

const castle = z
  .strictObject({
    id: z.string().regex(/^[a-z]+(-[a-z]+)*$/),
    ...name,
    former_names: z.array(formerName),
    /** Names used alongside the main one */
    other_names: z.array(z.strictObject(name)).optional(),
    /** One or two sentences, in Japanese */
    description: z.string().min(1).max(200),
    /** Article title on Japanese Wikipedia. null: no article */
    wikipedia_ja: z.string().min(1).nullable(),
    /** The castle's own site. null: none, or not recorded */
    official_url: z.url({ protocol: /^https$/ }).nullable(),
    /** File in public/image/, shown at the bottom of the panel. All are AI generated. */
    image: z
      .string()
      .regex(/^[a-z]+(-[a-z]+)*\.webp$/)
      .optional(),
    province: z.string().min(1),
    type: z.enum(['山城', '平山城', '平城', '館']),
    /** null: unknown */
    built: yearRange.nullable(),
    /** null: never abandoned, or unknown */
    abandoned: yearRange.nullable(),
    /** Oldest first. In a year of change, both owners include that year. */
    owners: z
      .array(owner)
      .refine(
        (list) => list.every((o, i) => i === 0 || list[i - 1].from <= o.from),
        'owners are not in order',
      ),
  })
  .refine(
    (c) => !c.built || !c.abandoned || c.built.latest <= c.abandoned.earliest,
    'abandoned before it was built',
  )

const castleFeature = z.strictObject({
  type: z.literal('Feature'),
  geometry: z.strictObject({
    type: z.literal('Point'),
    // [longitude, latitude], within Japan
    coordinates: z.tuple([
      z.number().min(122).max(154),
      z.number().min(24).max(46),
    ]),
  }),
  properties: castle,
})

export const castleCollection = z
  .strictObject({
    type: z.literal('FeatureCollection'),
    features: z.array(castleFeature).min(1),
  })
  .superRefine(({ features }, ctx) => {
    const seen = new Set<string>()
    features.forEach(({ properties: { id } }, i) => {
      if (seen.has(id)) {
        ctx.addIssue({
          code: 'custom',
          message: `duplicate id "${id}"`,
          path: ['features', i, 'properties', 'id'],
        })
      }
      seen.add(id)
    })
  })

export type Castle = z.infer<typeof castle>
export type CastleFeature = z.infer<typeof castleFeature>
export type CastleCollection = z.infer<typeof castleCollection>
