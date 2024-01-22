const sqlite3 = require('sqlite3').verbose()

const db_user = require('./db.js')

db_user.serialize( ()=> {
    const sql = `
    CREATE TABLE IF NOT EXISTS user
    (id integer primary key,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL UNIQUE,
        roles TEXT,
        FOREIGN KEY (roles) REFERENCES roles (value)
        )
    `
    db_user.run(sql)
})

module.exports = db_user