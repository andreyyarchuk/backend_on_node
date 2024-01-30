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

/**
The following route will check if there is an Email and Password
in the request. Then query the Users table
in the Users database with the Email
to get the password hash and compare it
to the Password posted by the user.
If successful, generate a JWT Token
with the user ID and email in the payload
which is base64 encoded.
This gets sent back with a status code of 200.
 */
const token = jwt.sign(
    {user_id: user[0].Id, // ReferenceError: user is not defined
    username: user[0].username,
    Email},
    process.env.TOLEN_KEY,
    {
        expiresIn: "1h"
    }
)

// Code for the Login Action
app.post("/Users", async (req, res) => {
    try {
        const {Email, Password} = req.body
        // Make sure there is an Email and Password in the request 
        if (!(Email && Password)) {
            res.status(400).send("All input is required")
        }

        let user = []

        var sql = 'SELECT * FROM User WHERE Email = ?'
        db.all(sql, Email, function(err, rows) {
            if (err) {
                res.status(400).json({"error": err.message})
                return
            }

        rows.forEach(function (row) {
            user.push(row)
        })

        var PHush = bcrypt.hash.hashSync(Password)

        if (PHush === user[0].Password) {
            // * CREATE JWT TOKEN

            const token = jwt.sign(
                {user_id: user[0].Id, username: user[0].Username, Email},
                    process.env.TOLEN_KEY,
                    {
                        expiresIn: "1h", // 60s = 60 seconds - (60m = 60 minutes, 2h = 2 hours, 2d = 2 days)
                    }
            )

            user[0].Token = token
        
        } else {
            return res.status(400).send('No Match')
        }

    return res.status(200).send(user)
        })

    } catch (error) {
        console.log(error)
    }
})

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