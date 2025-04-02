import { fakeTrait } from '@server/entities/tests/fakes'
import { getGenre, getWeightedRandomGenre } from '../getGenre'

export type GenreSelection = {
  genreId: number
  genreBias: number
}
describe('getWeightedRandomGenre', () => {
  it('returns one element of passed genre array', () => {
    const genres = [
      { genreId: 1, genreBias: 1.4 },
      { genreId: 2, genreBias: 1.2 },
      { genreId: 3, genreBias: 1.4 },
    ]
    const selected = getWeightedRandomGenre(genres)

    expect(genres).toContain(selected)
  })
  it('Should select genre with highest bias when others have 0', () => {
    const genres = [
      { genreId: 1, genreBias: 1.4 },
      { genreId: 2, genreBias: 0 },
      { genreId: 3, genreBias: 0 },
    ]
    const selected = getWeightedRandomGenre(genres)

    expect(selected).toEqual({ genreId: 1, genreBias: 1.4 })
  })
})
describe('getGenre', () => {
  it('returns one slected genre from provided traits', () => {
    const trait1 = { id: 1, ...fakeTrait({ genreId: 1, genreBias: 1 }) }
    const trait2 = { id: 2, ...fakeTrait({ genreId: 2, genreBias: 0 }) }
    const trait3 = { id: 3, ...fakeTrait({ genreId: 3, genreBias: 0 }) }
    const traits = [trait1, trait2, trait3]

    const genre = getGenre(traits)

    expect(genre).toEqual({ genreId: 1, genreBias: 1 })
  })
})
