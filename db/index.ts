import { Pool } from "pg";

export const pool = new Pool({
  user: 'krasyo',
  host: 'localhost',
  database: 'forum_db',
  password: 'password',
  port: 5432,
})

export const query = async (text: string, params: any) => {
  return pool.query(text, params)
}
