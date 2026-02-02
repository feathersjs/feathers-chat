// For more information about this file see https://dove.feathersjs.com/guides/cli/validators.html
import AjvModule from 'ajv'
import addFormatsModule from 'ajv-formats'
import type { FormatsPluginOptions } from 'ajv-formats'

// Handle ESM/CJS interop
const Ajv = AjvModule.default || AjvModule
const addFormats = addFormatsModule.default || addFormatsModule

const formats: FormatsPluginOptions = [
  'date-time',
  'time',
  'date',
  'email',
  'hostname',
  'ipv4',
  'ipv6',
  'uri',
  'uri-reference',
  'uuid',
  'uri-template',
  'json-pointer',
  'relative-json-pointer',
  'regex'
]

export const dataValidator = addFormats(new Ajv({}), formats)

export const queryValidator = addFormats(
  new Ajv({
    coerceTypes: true
  }),
  formats
)
