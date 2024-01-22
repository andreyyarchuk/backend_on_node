const express = require('express')
require('dotenv').config() // Gives the application access to .env files. This is where we can put the keys for now.
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors') // Cross Origin Resource Sharing is needed if you want to use the API with an external application.
const jwt = require('jsonwebtoken') // Library to generate JWT tokens.
const bcrypt = require('bcryptjs') // This library is used to hash the passwords. BCRYPT is based on the Blowfish cipher

const app = express()

const DBSOURCE = 'usersdb.sqlite'
const auth = require('./midldleware')

const port = 3004