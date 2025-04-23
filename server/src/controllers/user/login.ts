import { publicProcedure } from '@server/trpc'
import provideRepos from '@server/trpc/provideRepos'
import { userRepository } from '@server/repositories/userRepository'
import { TRPCError } from '@trpc/server'
import { compare } from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken'
import config from '@server/config'
import { prepareTokenPayload } from '@server/trpc/tokenPayload'
import { z } from 'zod'

const { tokenKey } = config.auth

export default publicProcedure
  .use(provideRepos({ userRepository }))
  .input(z.object({ email: z.string(), password: z.string() }))
  .mutation(async ({ input: { email, password }, ctx }) => {
    const user = await ctx.repos.userRepository.findByEmail(email)
    if (!user) {
      ctx.logger.info({ email }, 'POST user.login - Email not found')
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Email not found',
      })
    }
    const match = await compare(password, user.password)
    if (!match) {
      ctx.logger.info({ email }, 'POST user.login - Incorrect password')
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Incorrect password',
      })
    }
    const tokenPayload = prepareTokenPayload(user)

    const accessToken = jsonwebtoken.sign(tokenPayload, tokenKey, {
      expiresIn: '7d',
    })
    ctx.logger.info(
      { userId: tokenPayload.user.id },
      'POST user.login - User logged in'
    )
    return { accessToken }
  })
