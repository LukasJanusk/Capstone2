import z from 'zod'
import { publicProcedure } from '../../trpc'

export default publicProcedure
  .input(
    z.object({
      prompt: z.string().max(200).min(1),
      lyric: z.string().min(1).max(1000),
      title: z.string().min(1).max(100),
    })
  )
  .mutation(async ({ input, ctx }) => {
    console.log('trying to access songs in api')
    const songs = await ctx.songGenerationService.getSongs(
      input.prompt,
      input.lyric,
      input.title
    )
    console.log(songs)
    return songs
  })
