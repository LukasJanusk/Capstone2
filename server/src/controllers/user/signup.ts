import { hash } from 'bcrypt'
import config from '@server/config'
import { publicProcedure } from '@server/trpc'
import provideRepos from '@server/trpc/provideRepos'
import { userRepository } from '@server/repositories/userRepository'
import { userSignupSchema } from '@server/entities/user'

export default publicProcedure
  .use(
    provideRepos({
      userRepository,
    })
  )
  .input(userSignupSchema)
  .mutation(async ({ input, ctx: { repos } }) => {
    // TODO: Error handling
    const { traits, ...user } = input
    const passwordHash = await hash(user.password, config.auth.passwordCost)
    const newUser = await repos.userRepository.create({
      ...user,
      password: passwordHash,
    })
    const userTraits = traits.map((t) => ({
      traitId: t.id,
      userId: newUser.id,
    }))
    await repos.userRepository.createUserTrait(userTraits)

    return { id: newUser.id }
  })
