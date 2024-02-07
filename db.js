const sqlite3 = require('sqlite3').verbose()
const dbName = 'later.sqlite'
var bcrypt = require('bcryptjs')

const db = new sqlite3.Database(dbName)


    // create table for articles
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

    // create table for users

var salt = bcrypt.genSaltSync(10);
    
db.run(`CREATE TABLE Users (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Username text, 
    Email text, 
    Password text,             
    Salt text,    
    Token text,
    DateLoggedIn DATE,
    DateCreated DATE
    )`,
(err) => {
    if (err) {
        // Table already created
    } else{
        // Table just created, creating some rows
        var insert = 'INSERT INTO Users (Username, Email, Password, Salt, DateCreated) VALUES (?,?,?,?,?)'
        db.run(insert, ["user1", "user1@example.com", bcrypt.hashSync("user1", salt), salt, Date('now')])
        db.run(insert, ["user2", "user2@example.com", bcrypt.hashSync("user2", salt), salt, Date('now')])
        db.run(insert, ["user3", "user3@example.com", bcrypt.hashSync("user3", salt), salt, Date('now')])
        db.run(insert, ["user4", "user4@example.com", bcrypt.hashSync("user4", salt), salt, Date('now')])
    }
}); 


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

class User {
    static all(cb) {
        db.all('SELECT * FROM Users', cb)
    }
}

module.exports = db
module.exports = dbName
module.exports.Article = Article
module.exports.User = User