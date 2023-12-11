const express = require('express')
// import express from 'express'

const port = 5000

const app = express()

app.get('/', (req, res) => {
    console.log(req.query)
    res.status(200).json('hello word')
})

app.listen(port, () => {
    console.log('server loading http://localhost:5000')
})