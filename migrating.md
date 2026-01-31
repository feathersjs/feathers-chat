# Migrating to Feathers v6 Pre

This document outlines the changes required to migrate a Feathers v5 TypeScript application to v6 pre.

## Package Updates

Update all `@feathersjs/*` packages from `^5.x` to `^6.0.0-pre.0`:

```json
{
  "dependencies": {
    "@feathersjs/adapter-commons": "^6.0.0-pre.0",
    "@feathersjs/authentication": "^6.0.0-pre.0",
    "@feathersjs/authentication-client": "^6.0.0-pre.0",
    "@feathersjs/authentication-local": "^6.0.0-pre.0",
    "@feathersjs/authentication-oauth": "^6.0.0-pre.0",
    "@feathersjs/configuration": "^6.0.0-pre.0",
    "@feathersjs/errors": "^6.0.0-pre.0",
    "@feathersjs/feathers": "^6.0.0-pre.0",
    "@feathersjs/knex": "^6.0.0-pre.0",
    "@feathersjs/koa": "^6.0.0-pre.0",
    "@feathersjs/schema": "^6.0.0-pre.0",
    "@feathersjs/socketio": "^6.0.0-pre.0",
    "@feathersjs/transport-commons": "^6.0.0-pre.0",
    "@feathersjs/typebox": "^6.0.0-pre.0"
  },
  "devDependencies": {
    "@feathersjs/cli": "^6.0.0-pre.0",
    "@feathersjs/rest-client": "^6.0.0-pre.0"
  }
}
```

## ESM Migration

Feathers v6 uses native ES modules. Several changes are required:

### 1. Add `"type": "module"` to package.json

```json
{
  "type": "module"
}
```

### 2. Update tsconfig.json

Change from CommonJS to ESNext modules:

```json
{
  "compilerOptions": {
    "target": "es2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "outDir": "./lib",
    "rootDir": "./src",
    "declaration": true,
    "strict": true,
    "esModuleInterop": true
  }
}
```

Remove the `ts-node` configuration block if present.

### 3. Replace ts-node with tsx

Add `tsx` as a dev dependency:

```bash
npm install --save-dev tsx
```

Update npm scripts to use `tsx` instead of `ts-node`:

```json
{
  "scripts": {
    "dev": "nodemon -x tsx src/index.ts",
    "mocha": "cross-env NODE_ENV=test mocha -n import=tsx --recursive --extension .ts --exit test/",
    "migrate": "node --import tsx ./node_modules/.bin/knex migrate:latest",
    "migrate:make": "node --import tsx ./node_modules/.bin/knex migrate:make"
  }
}
```

### 4. Update knexfile.ts exports

Change from CommonJS to ES module export:

```typescript
// Before
module.exports = config

// After
export default config
```

## TypeBox Schema Changes

### 1. `querySyntax` requires a second argument

The `querySyntax` function now requires an `extensions` object as the second argument:

```typescript
// Before
querySyntax(queryProperties)

// After
querySyntax(queryProperties, {})
```

### 2. `Type.Ref` expects a string

`Type.Ref` now takes the schema's `$id` string instead of the schema object:

```typescript
// Before
import { userSchema } from '../users/users.schema'
user: Type.Ref(userSchema)

// After
import '../users/users.schema'  // Side-effect import to register the schema
user: Type.Ref('User')
```

**Important:** When using `Type.Ref('SchemaId')`, the referenced schema must be registered with the validator before the referencing schema is compiled. This happens automatically when the module containing the referenced schema is imported (as a side-effect import).

### 3. Wrap `Type.Intersect` with `Type.Evaluate`

Complex intersection types should be wrapped with `Type.Evaluate` for proper schema resolution:

```typescript
// Before
export const configurationSchema = Type.Intersect([
  defaultAppConfiguration,
  Type.Object({
    host: Type.String(),
    port: Type.Number(),
    public: Type.String()
  })
])

// After
export const configurationSchema = Type.Evaluate(
  Type.Intersect([
    defaultAppConfiguration,
    Type.Object({
      host: Type.String(),
      port: Type.Number(),
      public: Type.String()
    })
  ])
)
```

Similarly for query schemas:

```typescript
// Before
export const messageQuerySchema = Type.Intersect(
  [
    querySyntax(messageQueryProperties),
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)

// After
export const messageQuerySchema = Type.Evaluate(
  Type.Intersect(
    [
      querySyntax(messageQueryProperties, {}),
      Type.Object({}, { additionalProperties: false })
    ],
    { additionalProperties: false }
  )
)
```

## Summary of File Changes

| File | Changes |
|------|---------|
| `package.json` | Add `"type": "module"`, update scripts to use `tsx`, update `@feathersjs/*` to v6 |
| `tsconfig.json` | Change `module` to `ESNext`, add `moduleResolution: "bundler"`, remove `ts-node` block |
| `knexfile.ts` | Change `module.exports` to `export default` |
| `src/configuration.ts` | Wrap schema with `Type.Evaluate` |
| `src/services/*/users.schema.ts` | Add `{}` to `querySyntax`, wrap query schema with `Type.Evaluate` |
| `src/services/messages/messages.schema.ts` | Change `Type.Ref(userSchema)` to `Type.Ref('User')`, use side-effect import, add `{}` to `querySyntax`, wrap query schema with `Type.Evaluate` |
