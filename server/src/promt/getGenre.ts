import type { Trait } from '@server/entities/traits'

export type GenreSelection = {
  genreId: number
  genreBias: number
}

export function getWeightedRandomGenre(
  items: Array<GenreSelection>
): GenreSelection {
  const weights = items.reduce((acc, item, i) => {
    const previousWeight = acc[i - 1] ?? 0
    acc.push(previousWeight + item.genreBias)
    return acc
  }, [] as number[])

  const totalWeight = weights[weights.length - 1]
  const random = Math.random() * totalWeight

  return items[weights.findIndex((weight) => weight > random)]
}

export function getGenre(traits: Trait[]) {
  const traitGenres = traits.map((t) => ({
    genreId: t.genreId,
    genreBias: t.genreBias,
  }))
  return getWeightedRandomGenre(traitGenres)
}
