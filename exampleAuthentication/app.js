const express = require('express'); // Using the express framework
const app = express(); 
require("dotenv").config(); // Get environment variables from .env file(s)
var sqlite3 = require('sqlite3').verbose()
const cors = require('cors'); 
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const DBSOURCE = "usersdb.sqlite";
const auth = require("./middleware");

const port = 3004;


// Recommended if you plan to use an external web application to call this API.
app.use(
    express.urlencoded(),
    cors({
        origin: 'http://localhost:3000'
    })
)

const token = jwt.sign(
    {user_id: user[0].Id,
    username: user[0].username,
    Email},
    process.env.TOLEN_KEY,
    {
        expiresIn: "1h"
    }
)


let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    } 
    else {        
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
    }
});

function startApp() {
    try {
        app.listen(port, () => {
            console.log(`server loanding http://localhost:${port}`)
        })
    } catch (error) {
       console.log(error) 
    }
}

startApp()