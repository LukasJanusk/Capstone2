import { trpc } from '@/trpc'
import type { TraitPublic } from '@server/shared/trpc'

export const getTraits = async (): Promise<TraitPublic[]> => {
  const traits = await trpc.trait.getAll.query()
  return traits
}
