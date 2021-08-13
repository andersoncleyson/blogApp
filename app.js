
//Carregango módulos
const express = require('express')

const handlebars = require('express-handlebars')

const bodyParser = require('body-parser')

const app = express()

const admin = require("./routes/admin")

//const mongoose = require('mongoose')

// Configurações
// Body Parser
app.use(express.urlencoded({extended: true}))
app.use(express.json())

//Handlebars
app.engine('handlebars', handlebars({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

// Mongoose

    // Em breve

// Rotas

app.use('/admin', admin)

// Outros

const PORT = 3000
app.listen(PORT, () => {
    console.log("Server is running...")
})
