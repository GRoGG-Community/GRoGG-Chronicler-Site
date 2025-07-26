import { Database } from "sqlite3";

export default class DbClient {
    private connection?: Promise<Database> = undefined

    constructor() {
        this.connect()
    }

    private connect() {
        if (this.connection) {
            return
        }

        this.connection = new Promise((resolve) => {
            const db = new Database("chatlogs.sqlite", (error) => {
                if (error == null) {
                    this.setup(db)
                    resolve(db);
                } else {
                    throw Error(`DB Init failed: ${error.message}`)
                }
            })
        })
    }

    private setup(db: Database) {
        db
        .exec("begin transaction")
        .exec(`create table if not exists empires
               (
                   id integer primary key autoincrement,
                   account_id integer not null,
                   name text not null,
                   lore text not null,
                   stats text not null,
                   ethics text not null,
                   special text not null
               )`
        ).exec("commit transaction")
    }
}