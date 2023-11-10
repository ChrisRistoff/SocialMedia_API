import * as db from "../db/index"

export const getPostsModel = async () => {
  try {
    const result = await db.query(`SELECT * FROM js_be;`, [])
    return result
  } catch (error) {
    console.log(error)
  }
}
