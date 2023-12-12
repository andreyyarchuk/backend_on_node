const express = require('express')
// import express from 'express'

const db = require('./db.js')

const port = 5000

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    console.log(req.query)
    res.status(200).json('hello word')
})

app.post('/', async (req, res) => {
    const {author, title, content, picture} = req.body
    const post = await db.create({author, title, content, picture})
    res.status(200).json('hello word')
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