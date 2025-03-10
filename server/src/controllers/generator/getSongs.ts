import z from 'zod'
import { publicProcedure } from '../../trpc'

export default publicProcedure
  .input(
    z.object({
      prompt: z.string().max(200).min(1),
      lyric: z.string().min(1).max(1000).nullable(),
      title: z.string().min(1).max(100).nullable(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const songs = await ctx.songGenerationService!.getSongs(
      input.prompt,
      input.lyric ?? undefined,
      input.title ?? undefined
    )

    return songs
  })
