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
