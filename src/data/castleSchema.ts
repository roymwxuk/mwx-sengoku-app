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
  .strictObject({ clan: z.string().min(1), from: year, to: year.nullable() })
  .refine((o) => o.to === null || o.from <= o.to, 'from is after to')

const castle = z
  .strictObject({
    id: z.string().regex(/^[a-z]+(-[a-z]+)*$/),
    ...name,
    former_names: z.array(formerName),
    /** One or two sentences, in Japanese */
    description: z.string().min(1).max(200),
    /** Article title on Japanese Wikipedia. null: no article */
    wikipedia_ja: z.string().min(1).nullable(),
    province: z.string().min(1),
    type: z.enum(['山城', '平山城', '平城', '館']),
    /** null: unknown */
    built: yearRange.nullable(),
    /** null: never abandoned, or unknown */
    abandoned: yearRange.nullable(),
    owners: z.array(owner),
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
