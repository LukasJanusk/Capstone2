import { publicProcedure } from '@server/trpc'
import provideRepos from '@server/trpc/provideRepos'
import { userRepository } from '@server/repositories/userRepository'
import { userSigninSchema } from '@server/entities/user'
import { TRPCError } from '@trpc/server'
import { compare } from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from '@server/config'
import { prepareTokenPayload } from '@server/trpc/tokenPayload'

const { tokenKey } = config.auth

export default publicProcedure
  .use(provideRepos({ userRepository }))
  .input(userSigninSchema)
  .mutation(async ({ input: { email, password }, ctx }) => {
    const user = await ctx.repos.userRepository.findByEmail(email)
    if (!user)
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Email not found',
      })

    const match = await compare(password, user.password)
    if (!match)
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Incorrect password',
      })

    const tokenPayload = prepareTokenPayload(user)
    const accessToken = jwt.sign(tokenPayload, tokenKey, { expiresIn: '7d' })

    return { accessToken }
  })
