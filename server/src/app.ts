import express, { Express } from "express"
import DbClient from "./db/dbClient"

export default function app(dbClient: DbClient): Express {
    const app = express()

    app.get("/empires", (res, resp) => {
        resp.sendStatus(500)
    })
    return app
}
