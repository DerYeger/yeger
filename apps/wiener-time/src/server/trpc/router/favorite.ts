import { authedProcedure, t } from '../utils'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'

export const favoriteRouter = t.router({
  getAll: t.procedure.query(async ({ ctx }) => {
    const userId = ctx.session?.user?.id
    if (!userId) {
      return undefined
    }
    return new Set([
      ...(
        await ctx.prisma.user
          .findFirstOrThrow({
            select: {
              favorites: true,
            },
            where: {
              id: {
                equals: userId,
              },
            },
          })
          .favorites()
      ).map((favorite) => favorite.name),
    ])
  }),
  getByStationName: t.procedure
    .input(z.object({ stationName: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session?.user?.id
      if (!userId) {
        return undefined
      }
      const favorite = await ctx.prisma.favorite.findFirst({
        where: {
          userId: {
            equals: userId,
          },
          name: {
            equals: input.stationName,
          },
        },
      })
      return favorite !== null
    }),
  add: authedProcedure
    .input(z.object({ stationName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id
      if (!userId) {
        throw new TRPCError({ code: 'BAD_REQUEST' })
      }
      await ctx.prisma.favorite.create({
        data: {
          name: input.stationName,
          userId,
        },
      })
    }),
  remove: authedProcedure
    .input(z.object({ stationName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id
      if (!userId) {
        throw new TRPCError({ code: 'BAD_REQUEST' })
      }
      await ctx.prisma.favorite.delete({
        where: {
          name_userId: {
            name: input.stationName,
            userId,
          },
        },
      })
    }),
})
