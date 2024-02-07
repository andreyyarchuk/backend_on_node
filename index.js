const express = require('express')
const Article = require('./db.js').Article
const db = require('./db.js').db
// const User = require('./db.js').User
// const db = require('./db.js').db
const bodyParser =require('body-parser')
const sqlite3 = require('sqlite3').verbose()
// additional modules for authorization 
const auth = require("./middleware");
require("dotenv").config()
var md5 = require('md5')
const cors = require('cors');
var jwt = require('jsonwebtoken');

// 

const PORT = process.env.PORT || 5000

const app = express()

app.use(express.json())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded( {extended: true}))

const MSG = {
    HELLO: "hello word",
    BODY404: "Not found body",
    OK: "ok"
}


// methods for ARTICLES
app.post('/articles', (req, res, next) => {
    const result = req.body
    const url = req.url
    console.log(result)
    if (!req.body) return res.status(404).json(MSG.BODY404)
    Article.create(
        {author: result.author, title: result.title, content: result.content, picture: result.picture},
        (err, article) => {
            if (err) return next(err)
            res.send(MSG.OK)
        }
    )
})

app.put('/articles/:id', (req, res, next) => {
    var data = {
        author: req.body.author,
        title: req.body.title,
        content: req.body.content,
        picture: req.body.picture
    }
    db.run(
            `UPDATE articles set 
            author = COALESCE(?,author), 
            title = COALESCE(?,title), 
            content = COALESCE(?,content),
            picture =  COALESCE(?,picture)
            WHERE id = ?`,
            [data.author, data.title, data.content, data.picture, req.params.id],
            function (err, result) {
                if (err){
                    res.status(400).json({"error": err.message})
                    return;
                }
                res.json({
                    message: "success",
                    data: data,
                    changes: this.changes
                })
            });
})

app.get('/articles', (req, res, next) => {
    Article.all((err, articles) => {
        if (err) return next(err)
        res.send(articles)
})
})


app.get('/articles/:id', (req, res, next) => {
    const id = req.params.id
    Article.find(id, (err, data) => {
        if (err) return next(err)
        res.send(data)
})
})


app.delete('/articles/:id', (req, res, next) => {
    const id = req.params.id
    Article.delete(id, (err) => {
        if (err) return next(err)
        res.send({message: 'Deleted'})
})
})

app.use(
    express.urlencoded(({ extended: true })),
    cors({
        origin: 'http://localhost:3000'
    })
);

// code for Authentication
// * R E G I S T E R   N E W   U S E R
app.post("/api/register", async (req, res) => {
    var errors=[]
    try {
        console.log(req.body)
        const { Username, Email, Password } = req.body;

        if (!Username){
            errors.push("Username is missing");
        }
        if (!Email){
            errors.push("Email is missing");
        }
        if (errors.length){
            res.status(400).json({"error":errors.join(",")});
            return;
        }
        let userExists = false;
        
        
        var sql = "SELECT * FROM Users WHERE Email = ?"        
        await db.all(sql, Email, (err, result) => {
            if (err) {
                res.status(402).json({"error":err.message});
                return;
            }
            
            if(result.length === 0) {                
                
                var salt = bcrypt.genSaltSync(10);

                var data = {
                    Username: Username,
                    Email: Email,
                    Password: bcrypt.hashSync(Password, salt),
                    Salt: salt,
                    DateCreated: Date('now')
                }
        
                var sql ='INSERT INTO Users (Username, Email, Password, Salt, DateCreated) VALUES (?,?,?,?,?)'
                var params =[data.Username, data.Email, data.Password, data.Salt, Date('now')]
                var user = db.run(sql, params, function (err, innerResult) {
                    if (err){
                        res.status(400).json({"error": err.message})
                        return;
                    }
                  
                });           
            }            
            else {
                userExists = true;
                // res.status(404).send("User Already Exist. Please Login");  
            }
        });
  
        setTimeout(() => {
            if(!userExists) {
                res.status(201).json("Success");    
            } else {
                res.status(201).json("Record already exists. Please login");    
            }            
        }, 500);


    } catch (err) {
      console.log(err);
    }
})



app.post("/api/test", auth, (req, res) => {
    // console.log(req.user)
    res.status(200).send("Token Works - Yay!");
});

async function startApp() {
    try {
        app.listen(PORT, () => {
            console.log(`server loading http://localhost:${5000}`)
        })
    } catch (error) {
        console.log(error)
    }
}

startApp()