import * as db from "../db/index";

afterAll(() => db.pool.end());

describe("seed", () => {
  describe("user", () => {
    it("user is created", async () => {
      const res = await db.query(
        `
        SELECT * FROM users WHERE username = 'test'
      `,
        [],
      );

      const user = res.rows[0];
      expect(user).toHaveProperty("user_id");
      expect(user).toHaveProperty("username");
      expect(user).toHaveProperty("email");
      expect(user).toHaveProperty("password");
      expect(user.user_id).toBe(1);
      expect(user.username).toBe("test");
      expect(user.email).toBe("test@test.test");
    });
  });

  describe("groups", () => {
    it("groups are created", async () => {
      const res = await db.query(
        `
        SELECT * FROM groups;
      `,
        [],
      );

      const category = res.rows[0];
      expect(category).toHaveProperty("group_name");
      expect(category).toHaveProperty("description");
      expect(category.group_name).toBe("JavaScript BE");
      expect(category.description).toBe("Everything JS backend");
      expect(category.group_id).toBe(1);

      const category1 = res.rows[1];
      expect(category1).toHaveProperty("group_name");
      expect(category1).toHaveProperty("description");
      expect(category1.group_name).toBe("DATABASES");
      expect(category1.description).toBe("Everything DATABASES");
      expect(category1.group_id).toBe(2);
    });
  });

  describe("posts", () => {
    it("post is created", async () => {
      const res = await db.query(
        `
        SELECT * FROM posts WHERE post_id = 1;
      `,
        [],
      );

      const post = res.rows[0];
      expect(post).toHaveProperty("title");
      expect(post).toHaveProperty("content");
      expect(post).toHaveProperty("group_id");
      expect(post).toHaveProperty("user_id");
      expect(post.title).toBe("test post title");
      expect(post.content).toBe("test post content");
      expect(post.group_id).toBe(1);
      expect(post.user_id).toBe(1);
    });
  });

  describe("comment", () => {
    it("comment is created", async () => {
      const res = await db.query(
        `
        SELECT * FROM comments WHERE comment_id = 1
      `,
        [],
      );

      const post = res.rows[0];
      expect(post).toHaveProperty("comment_content");
      expect(post).toHaveProperty("post_id");
      expect(post).toHaveProperty("user_id");
      expect(post.comment_content).toBe("test comment content");
      expect(post.post_id).toBe(1);
      expect(post.user_id).toBe(1);
    });
  });

  describe("replies", () => {
    it("reply is created", async () => {
      const res = await db.query(
        `
        SELECT * FROM comments WHERE reply_to_comment_id = 1
      `,
        [],
      );

      const reply = res.rows[0];
      expect(reply).toHaveProperty("comment_content");
      expect(reply).toHaveProperty("user_id");
      expect(reply).toHaveProperty("post_id");
      expect(reply).toHaveProperty("reply_to_comment_id");
      expect(reply.comment_content).toBe("test reply content");
      expect(reply.user_id).toBe(1);
      expect(reply.post_id).toBe(1);
      expect(reply.reply_to_comment_id).toBe(1);
    });
  });
});
