import express, { json } from "express";
import { Request, Response } from "express";
import * as db from "./db/index"

const app = express()
app.use(json())

app.listen(8080, () => {
  console.log("Server listening on port 8080")
})
