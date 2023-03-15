// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'
import { v4 } from 'uuid'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'

// Main data model schema
export const routeSchema = Type.Object(
  {
    id: Type.String({
      format: 'uuid'
    }),
    route: Type.String(),
    project: Type.String(),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.String({ format: 'date-time' }),
  },
  { $id: 'Route', additionalProperties: false }
)
export type Route = Static<typeof routeSchema>
export const routeValidator = getValidator(routeSchema, dataValidator)
export const routeResolver = resolve<Route, HookContext>({})

export const routeExternalResolver = resolve<Route, HookContext>({})

// Schema for creating new entries
export const routeDataSchema = Type.Pick(routeSchema, ['route', 'project'], {
  $id: 'RouteData'
})
export type RouteData = Static<typeof routeDataSchema>
export const routeDataValidator = getValidator(routeDataSchema, dataValidator)
export const routeDataResolver = resolve<Route, HookContext>({
  id: async () => {
    return v4()
  },
  createdAt: async () => {
    return (new Date()).getUTCDate().toString()
  }
})

// Schema for updating existing entries
export const routePatchSchema = Type.Partial(routeSchema, {
  $id: 'RoutePatch'
})
export type RoutePatch = Static<typeof routePatchSchema>
export const routePatchValidator = getValidator(routePatchSchema, dataValidator)
export const routePatchResolver = resolve<Route, HookContext>({})

// Schema for allowed query properties
export const routeQueryProperties = Type.Pick(routeSchema, ['id', 'route', 'project'])
export const routeQuerySchema = Type.Intersect(
  [
    querySyntax(routeQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type RouteQuery = Static<typeof routeQuerySchema>
export const routeQueryValidator = getValidator(routeQuerySchema, queryValidator)
export const routeQueryResolver = resolve<RouteQuery, HookContext>({})
