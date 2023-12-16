const sqlite = require('sqlite3').verbose()
const db = new sqlite.Database('./quote.db', sqlite.OPEN_READWRITE, (err) => {
    if (err) return console.error(err)
})

const sql = `CREATE TABLE   qoute(ID INTEGER PRIMARY KEY, movie, character)`
db.run(sql)