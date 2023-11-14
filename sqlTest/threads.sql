\c forum_db

SELECT t.category_id, t.thread_id, t.title, t.content, u.username AS creator_username,
COUNT(p.post_id) AS post_count,
MAX(p.created_at) AS last_post_date
FROM threads t
LEFT JOIN posts p ON p.thread_id = t.thread_id
LEFT JOIN users u ON t.user_id = u.user_id
WHERE t.category_id = 1
GROUP BY t.category_id, t.thread_id, t.title, t.content, u.username;
