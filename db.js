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

class Article {
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

// db.serialize( ()=> {
//     const sql = `
//     CREATE TABLE IF NOT EXISTS login
//     (id integer primary key,
//         login TEXT,
//         password TEXT,
//         gender TEXT,
//         age INTEGER)
//     `
//     db.run(sql)
// })

// db.serialize( ()=> {
//     const sql = `
//     CREATE TABLE IF NOT EXISTS user
//     (id integer primary key,
//         username TEXT NOT NULL UNIQUE,
//         password TEXT NOT NULL UNIQUE,
//         roles TEXT,
//         FOREIGN KEY (roles) REFERENCES roles (value)
//         )
//     `
//     db.run(sql)
// })

// db.serialize( ()=> {
//     const sql = `
//     CREATE TABLE IF NOT EXISTS roles
//     (value TEXT NOT NULL DEFAULT user
//         )
//     `
//     db.run(sql)
// })


// class Login {
//     static all(cb) {
//         db.all('SELECT * FROM login', cb)
//     }

//     static find(id, cb) {
//         db.get('SELECT * FROM login WHERE id = ?', id, cb)
//     }

//     static create(data, cb) {
//         const sql = 'INSERT INTO login(login, password, gender, age) VALUES (?,?,?,?)'
//         db.run(sql, data.login, data.password, data.gender, data.age, cb)
//     }

//     static delete(id, cb) {
//         if (!id) return cb(new Error('Please provide an id'))
//         db.run('DELETE FROM login WHERE id = ?', id, cb)
//     }

// }


module.exports = db
module.exports.Article = Article
// module.exports.Login = Login