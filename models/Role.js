const sqlite3 = require('sqlite3').verbose()

const db = require('./db.js')

db_role.serialize( ()=> {
    const sql = `
    CREATE TABLE IF NOT EXISTS roles
    (value TEXT NOT NULL DEFAULT USER
        )
    `
    db.run(sql)
})

module.exports.db = db_rules