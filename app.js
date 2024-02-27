// Imports
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()

const PORT = 3000

// Open Route - Public Route
app.get('/', (req, res) => {
    res.status(200).json({ msg: 'Hello World' })
})

// Credencials
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS

mongoose
    .connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.a7thngl.mongodb.net/AuthDb?retryWrites=true&w=majority`, 
    )
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Servidor rodando em: http://localhost:${PORT}`)
        })
    })
    .catch((err) => console.log(err))
