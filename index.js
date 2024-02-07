const express = require('express')
const Article = require('./db.js').Article
const Login = require('./db.js').Login
const bodyParser =require('body-parser')

// additional modules for authorization 
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

// code for authorization

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