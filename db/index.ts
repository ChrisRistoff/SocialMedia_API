import { Pool } from "pg";
import path from "path";

const ENV = process.env.NODE_ENV || "dev"
const envFilePath = path.join(`./.env.${ENV}`)

const wtf = require("dotenv").config({
  path: envFilePath
})

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: +process.env.DB_PORT,
});

export const query = async (text: string, params: any) => {
  return pool.query(text, params);
};
