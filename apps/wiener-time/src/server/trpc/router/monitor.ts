import { t } from '../utils'
import { z } from 'zod'
import lib from '../../../lib'

export const monitorRouter = t.router({
  getAllByStopIds: t.procedure
    .input(z.object({ stopIds: z.array(z.number()) }))
    .query(async ({ input }) => {
      return lib.fetchMonitorData(input.stopIds)
    }),
})
