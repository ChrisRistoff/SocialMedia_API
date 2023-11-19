import * as db from "../db/index"

export const createGroupModel = async(group_name: string, description: string, user_id: number) => {
  const group = await db.query(`
    INSERT INTO groups (group_name, description, user_id)
    VALUES ($1, $2, $3) RETURNING *
  `, [group_name, description, user_id])

  return group.rows[0]
}

export const joinGroupModel = async (group_id: number, user_id: number) => {
  const group = await db.query(`
    INSERT INTO group_members (user_id, group_id)
    VALUES ($1, $2) RETURNING *
  `, [user_id, group_id])

  return "You have successfully joined the group"
}
