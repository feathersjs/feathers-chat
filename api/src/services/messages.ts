import { DatabaseSync } from 'node:sqlite'
import type { Params } from 'feathers'
import { hooks } from 'feathers/hooks'
import { NotFound } from 'feathers/errors'

import { authenticate } from '../hooks/authenticate.js'
import { TalonAuthUser } from 'talon-auth'

export type Message = {
  id?: number
  text: string
  createdAt: string
  user: string
}

const db = new DatabaseSync(':memory:')

db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    user TEXT NOT NULL
  )
`)

@hooks([authenticate])
export class MessageService {
  async find(params: Params) {
    const limit = params.query?.$limit ?? 25
    const data = db.prepare('SELECT * FROM messages ORDER BY createdAt DESC LIMIT ?').all(limit) as Message[]

    return { limit, data }
  }

  async get(id: string, _params: Params) {
    const message = db.prepare('SELECT * FROM messages WHERE id = ?').get(id) as Message | undefined

    if (!message) {
      throw new NotFound(`Message ${id} not found`)
    }

    return message
  }

  async create(data: Pick<Message, 'text'>, params: Params & {
    user: TalonAuthUser
   }) {
    const createdAt = new Date().toISOString()
    const result = db.prepare('INSERT INTO messages (text, createdAt, user) VALUES (?, ?, ?)').run(
      data.text,
      createdAt,
      params.user.email!
    )

    return this.get(result.lastInsertRowid, params)
  }

  async remove(id: string, _params: Params) {
    const message = await this.get(id, _params)

    db.prepare('DELETE FROM messages WHERE id = ?').run(id)

    return message
  }
}
