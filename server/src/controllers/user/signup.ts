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
  .mutation(async ({ input, ctx: { repos, logger } }) => {
    const { traits, ...user } = input
    const passwordHash = await hash(user.password, config.auth.passwordCost)
    const newUser = await repos.userRepository.create({
      ...user,
      password: passwordHash,
    })
    logger.info({ id: newUser.id }, 'POST user.signup - User created')
    const userTraits = traits.map((t) => ({
      traitId: t.id,
      userId: newUser.id,
    }))
    const newUserTraits = await repos.userRepository.createUserTrait(userTraits)
    logger.info(
      newUserTraits.map((t) => t.id),
      'POST user.signup - User traits created'
    )

    return { id: newUser.id }
  })
