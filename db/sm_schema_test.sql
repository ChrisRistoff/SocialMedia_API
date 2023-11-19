DROP DATABASE IF EXISTS sm_db_test;
CREATE DATABASE sm_db_test;

\c sm_db_test

CREATE TABLE IF NOT EXISTS users(
    user_id SERIAL PRIMARY KEY,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    username TEXT ,
    email TEXT,
    password TEXT
);

CREATE TABLE IF NOT EXISTS groups(
    group_id SERIAL PRIMARY KEY,
    group_name TEXT,
    description TEXT,
    user_id INTEGER REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS group_members(
    user_id INTEGER REFERENCES users(user_id),
    group_id INTEGER REFERENCES groups(group_id),
    PRIMARY KEY(user_id, group_id)
);

CREATE TABLE IF NOT EXISTS posts(
    post_id SERIAL PRIMARY KEY,
    title TEXT,
    content TEXT,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    group_id INTEGER REFERENCES groups(group_id),
    user_id INTEGER REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS comments(
    comment_id SERIAL PRIMARY KEY,
    comment_content TEXT,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER REFERENCES users(user_id),
    post_id INTEGER REFERENCES posts(post_id),
    reply_to_comment_id INTEGER REFERENCES comments(comment_id)
);

CREATE TABLE IF NOT EXISTS reactions(
    reaction_id SERIAL PRIMARY KEY,
    reaction_type VARCHAR(20),
    post_id INTEGER REFERENCES posts(post_id),
    comment_id INTEGER REFERENCES comments(comment_id),
    user_id INTEGER REFERENCES users(user_id) NOT NULL
);
