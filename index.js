const express = require('express')

const db = require('./db.js')

const bodyParser =require('body-parser')

const read = require('node-readability')

const Article = require('./db.js').Article

const port = 5000

const app = express()

app.use(express.json())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded( {extended: true}))

const MSG = {
    HELLO: "hello word",
    BODY404: "Not found body",
    OK: "ok"
}

app.get('/', (req, res) => {
    console.log(req.query)
    res.status(200).json('hello word')
})

// app.post('/articles', (req, res, next) => {
//     const result = req.body.result
//     // const url = req.url
//     // console.log(result)
//     console.log(req.body)
//     if (!req.body.result) return res.status(404).send(MSG.BODY404)
//     Article.create(
//         {author: result.author, title: result.title, content: result.content, picture: result.picture},
//         (err, article) => {
//             if (err) return next(err)
//             res.send(MSG.OK)
//         }
//     )
// })

app.post('/articles', (req, res, next) => {
    const result = req.body
    // const url = req.url
    // console.log(result)
    console.log(req.body)
    if (!req.body) return res.status(404).send(MSG.BODY404)
    Article.create(
        {author: result.author, title: result.title, content: result.content, picture: result.picture},
        (err, article) => {
            if (err) return next(err)
            res.send(MSG.OK)
        }
    )
})


async function startApp() {
    try {
        app.listen(port, () => {
            console.log('server loading http://localhost:5000')
        })
    } catch (error) {
        console.log(error)
    }
}

startApp()