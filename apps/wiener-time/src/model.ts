import { z } from 'zod'

export const Geometry = z.object({
  type: z.enum(['Point']),
  coordinates: z.tuple([z.number(), z.number()]),
})

export const VehicleSchema = z.object({
  name: z.string(),
  towards: z.string(),
  direction: z.enum(['R', 'H']),
  platform: z.string().nullish(),
  richtungsId: z.string(),
  barrierFree: z.boolean(),
  realtimeSupported: z.boolean(),
  trafficjam: z.boolean(),
})

export type Vehicle = z.infer<typeof VehicleSchema>

export const VehicleType = z.enum([
  'ptBusCity',
  'ptBusNight',
  'ptMetro',
  'ptTram',
  'ptTramVRT',
  'ptTramWLB',
])

export const DepartureSchema = z.object({
  departureTime: z.object({
    timePlanned: z.string().nullish(),
    timeReal: z.string().nullish(),
    countdown: z.number().nullish(),
  }),
  vehicle: VehicleSchema.extend({
    foldingRamp: z.boolean().nullish(),
    type: VehicleType,
    linienId: z.number(),
  }).nullish(),
})

export type Departure = z.infer<typeof DepartureSchema>

export const LineSchema = VehicleSchema.extend({
  departures: z.object({
    departure: z.array(DepartureSchema),
  }),
  type: VehicleType,
  lineId: z.number(),
})

export type Line = z.infer<typeof LineSchema>

export const StopSchema = z.object({
  type: z.enum(['Feature']),
  geometry: Geometry,
  properties: z.object({
    name: z.string(),
    title: z.string(),
    municipality: z.string(),
    municipalityId: z.number(),
    type: z.enum(['stop']),
    coordName: z.string(),
    gate: z.string().nullish(),
    attributes: z.object({
      rbl: z.number(),
    }),
  }),
})

export type Stop = z.infer<typeof StopSchema>

export const MonitorSchema = z.object({
  locationStop: StopSchema,
  lines: z.array(LineSchema),
})

export const MessageSchema = z.object({
  value: z.string(),
  messageCode: z.number(),
  serverTime: z.string(),
})

export type Monitor = z.infer<typeof MonitorSchema>

export const MonitorResponseSchema = z.object({
  data: z
    .object({
      monitors: z.array(MonitorSchema),
    })
    .nullish(),
  message: MessageSchema,
})

export type MonitorResponse = z.infer<typeof MonitorResponseSchema>

export const SingleMonitorResponseSchema = MonitorResponseSchema.extend({
  data: z
    .object({
      monitors: z.array(MonitorSchema).length(1),
    })
    .nullish(),
  message: MessageSchema,
})

export const StaticStopDataSchema = z.object({
  StopID: z.number(),
  DIVA: z.number().nullish(),
  StopText: z.string().nullish(),
  Municipality: z.string().nullish(),
  MunicipalityID: z.number().nullish(),
  Longitude: z.number().nullish(),
  Latitude: z.number().nullish(),
})

export type StaticStopData = z.infer<typeof StaticStopDataSchema>
