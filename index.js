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

app.get('/', (req, res) => {
    console.log(req.query)
    res.status(200).json('hello word')
})

app.post('/articles', (req, res, next) => {
    const url = req.body.url
    read(url, (err, result) => {
        if (err || !result) res.status(500).send('Error dowlondeing article')
        Article.create(
            {author: result.author, title: result.title, content: result.content, picture: result.picture},
            (err, article) => {
                if (err) return next(err)
                res.send('ok')
            }
        )
    })
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