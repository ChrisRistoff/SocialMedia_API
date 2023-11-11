\c forum_db

CREATE TABLE IF NOT EXISTS js_be (
    threads VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    username TEXT,
    email TEXT,
    password TEXT
);

CREATE TABLE IF NOT EXISTS categories (
    category_id SERIAL PRIMARY KEY,
    category_name TEXT,
    description TEXT
);

CREATE TABLE IF NOT EXISTS threads(
    thread_id SERIAL PRIMARY KEY,
    content TEXT,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    category_id INTEGER REFERENCES categories(category_id),
    user_id FOREIGN KEY REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS posts(
    post_id SERIAL PRIMARY KEY,
    post_content TEXT,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id FOREIGN KEY REFERENCES users(user_id),
    thread_id FOREIGN KEY REFERENCES threads(thread_id)
)

CREATE TABLE IF NOT EXISTS reactions (
    reaction_id SERIAL PRIMARY KEY,
    reaction_type VARCHAR(20),
    post_id FOREIGN KEY REFERENCES posts(post_id),
    user_id FOREIGN KEY REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS roles (
    user_id FOREIGN KEY REFERENCES users(user_id),
    role VARCHAR(20)
);
