import z from 'zod'

export const MusicGenreEnum = z.enum([
  'Pop',
  'Rock',
  'Electronic',
  'Hip-Hop',
  'Jazz',
  'Classical',
  'Indie',
  'Blues',
  'Country',
  'Reggae',
  'R&B',
  'Metal',
  'Ambient',
  'Folk',
  'Dancehall',
  'Experimental',
  'Alternative',
  'Latin',
  'House',
  'Trance',
  'Ska',
])

export const traitSchema = z.object({
  id: z.coerce.number().int().positive(),
  name: z.string().min(1).max(50),
  tempoMultiplier: z.coerce.number().positive(),
  moodMultiplier: z.coerce.number().positive(),
  energyMultiplier: z.coerce.number().positive(),
  complexityMultiplier: z.coerce.number().positive(),
  genre: z.coerce.number().positive(),
  genreBias: z.coerce.number().positive(),
})

const traitPublic = traitSchema.pick({ id: true, name: true })

export type TraitPublic = z.infer<typeof traitPublic>
export type Trait = z.infer<typeof traitSchema>

export const traitKeysPublic = Object.keys(traitSchema.shape) as (keyof Trait)[]
export const parseTrait = (data: unknown) => traitSchema.parse(data)
// Example of traits to put in DB
// const traits = [
//   'introvert',
//   'extrovert',
//   'assertive',
//   'passive',
//   'optimistic',
//   'pessimistic',
//   'talkative',
//   'quiet',
//   'empathetic',
//   'logical',
//   'independent',
//   'organized',
//   'flexible',
//   'adventurous',
//   'cautious',
//   'artistic',
//   'parctical',
// ]
