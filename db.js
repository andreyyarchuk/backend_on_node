const sqlite3 = require('sqlite3').verbose()
const dbName = 'later.sqlite'
const db = new sqlite3.Database(dbName)

db.serialize( ()=> {
    const sql = `
    CREATE TABLE IF NOT EXISTS articles
    (id integer primary key,
        author TEXT,
        title TEXT,
        content TEXT,
        picture TEXT)
    `
    db.run(sql)
})

class Article {s
    static all(cb) {
        db.all('SELECT * FROM articles', cb)
    }

    static find(id, cb) {
        db.get('SELECT * FROM articles WHERE id = ?', id, cb)
    }

    static create(data, cb) {
        const sql = 'INSERT INTO articles(author, title, content, picture) VALUES (?,?,?,?)'
        db.run(sql, data.author, data.title, data.content, data.picture, cb)
    }

    static delete(id, cb) {
        if (!id) return cb(new Error('Please provide an id'))
        db.run('DELETE FROM articles WHERE id = ?', id, cb)
    }


}

module.exports = db
module.exports.Article = Article