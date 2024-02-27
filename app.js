// Imports
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()

const PORT = 3000

// Config JSON response
app.use(express.json())

// Models
const User = require('./models/User.js')

// Open Route - Public Route
app.get('/', (req, res) => {
    res.status(200).json({ msg: 'Hello World' })
})

// Register User
app.post('/auth/register', async (req, res) => {
    const {name, email, password, confirmPassword} = req.body

    // Validações
    if (!name) {
        return res.status(422).json({ msg: 'O nome é obrigatório!' })
    }
    if (!email) {
        return res.status(422).json({ msg: 'O e-mail é obrigatório!' })
    }
    if (!password) {
        return res.status(422).json({ msg: 'A senha é obrigatório!' })
    }
    if (password !== confirmPassword) {
        return res.status(422).json({ msg: 'As senhas devem ser iguais!' })
    }

    // Check if user exists
    const userExists = await User.findOne({ email: email })

    if (userExists) {
        return res.status(422).json({ msg: 'Usuário já cadastrado!' })
    }

    // Create password
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    // Create user
    const user = new User({
        name,
        email,
        password,
    })

    try {
        await user.save()
        res.status(201).json({ msg: 'Usuário cadastrado com sucesso!' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: 'Erro interno do servidor, tente novamente mais tarde!' })
    }
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
