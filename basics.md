```

app.post("/thread", async (req: Request, res: Response) => {
  console.log(req.body)
  const title = req.body.title

  const result = await db.query(`INSERT INTO js_be (threads) VALUES ($1)`, [title])
  res.status(201).send({result})
})

app.get("/thread", async (req: Request, res: Response) => {
  const result = await db.query(`SELECT * FROM js_be;`, [])

  res.status(200).send(result.rows)
})

app.delete("/thread", async (req: Request, res: Response) => {
  const { title } = req.body

  const result = await db.query(`DELETE FROM js_be WHERE threads=$1`, [title])

  res.status(204).send({ result })
})

app.patch("/thread", async (req: Request, res: Response) => {
  const {oldTitle, newTitle} = req.body

  const newQuery = `UPDATE js_be
                SET threads=$2
                WHERE threads = $1`
  const result = await db.query(newQuery, [oldTitle, newTitle])

  res.status(201).send(result)
})

```
