// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('route', (table) => {
    table.uuid('id')
    table.primary(['id'])
    table.string('route')
    table.string('project')
    table.string('createdAt')
    table.string('updatedAt')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('route')
}
