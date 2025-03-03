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
  id: z.number().int().positive(),
  name: z.string().min(1).max(50),
  tempoMultiplier: z.number().positive(),
  moodMultiplier: z.number().positive(),
  energyMultiplier: z.number().positive(),
  complexityMultiplier: z.number().positive(),
  genre: z.number().positive(),
  genreBias: z.number().positive(),
})

const traitPublic = traitSchema.pick({ id: true, name: true })

export type TraitPublic = z.infer<typeof traitPublic>
export type Trait = z.infer<typeof traitSchema>

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
