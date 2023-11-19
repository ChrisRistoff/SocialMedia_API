import * as db from "../db/index";

export const createGroupModel = async (
  group_name: string,
  description: string,
  user_id: number,
) => {
  const user = await db.query(
    `
    SELECT * FROM users WHERE user_id = $1;
  `,
    [user_id],
  );

  if (user.rows.length < 1)
    return Promise.reject({ errCode: 404, errMsg: "User does not exist" });

  const group = await db.query(
    `
    INSERT INTO groups (group_name, description, user_id)
    VALUES ($1, $2, $3) RETURNING *
  `,
    [group_name, description, user_id],
  );

  await db.query(
    `
    INSERT INTO group_members (user_id, group_id)
    VALUES ($1, $2)
  `,
    [user_id, group.rows[0].group_id],
  );

  return group.rows[0];
};

export const joinGroupModel = async (group_id: number, user_id: number) => {
  const user = await db.query(
    `
    SELECT * FROM users WHERE user_id = $1;
  `,
    [user_id],
  );

  if (user.rows.length < 1)
    return Promise.reject({ errCode: 404, errMsg: "User does not exist" });

  const group = await db.query(
    `
    INSERT INTO group_members (user_id, group_id)
    VALUES ($1, $2)
  `,
    [user_id, group_id],
  );

  return "You have successfully joined the group";
};

export const getMembersOfGroupModel = async (group_id: number) => {
  const members = await db.query(
    `
    SELECT u.user_id, u.username FROM group_members gm
    JOIN users u
    ON u.user_id = gm.user_id
    WHERE gm.group_id = $1
  `,
    [group_id],
  );

  if (members.rows.length < 1)
    return Promise.reject({
      errCode: 404,
      errMsg: `Group with ID ${group_id} not found`,
    });

  return members.rows;
};

export const getGroupsOfUserModel = async (user_id: number) => {
  const user = await db.query(
    `
    SELECT * FROM users WHERE user_id = $1;
  `,
    [user_id],
  );

  if (user.rows.length < 1)
    return Promise.reject({ errCode: 404, errMsg: "User does not exist" });


  const groups = await db.query(
    `
    SELECT g.group_name, g.description, g.group_id
    FROM groups g
    JOIN group_members gm
    ON gm.user_id = $1
    WHERE gm.group_id = g.group_id;
  `,
    [user_id],
  );

  return groups.rows;
};
