
//Carregango módulos
const express = require('express')

const handlebars = require('express-handlebars')

const bodyParser = require('body-parser')

const app = express()

const admin = require("./routes/admin")

const path = require('path')

const mongoose = require('mongoose')

const session = require('express-session')

const flash = require("connect-flash")

// Configurações
app.use(session({
    secret: "anything",
    resave: true,
    saveUninitialized: true
}))
app.use(flash())

//Middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    next()
})

// Body Parser
app.use(express.urlencoded({extended: true}))
app.use(express.json())

//Handlebars
app.engine('handlebars', handlebars({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

// Mongoose
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/blogapp").then(() => {
    console.log("Server connected")
}).catch((err) => {
    console.log("connect fail" + err)
})

//Public
app.use(express.static(path.join(__dirname,"public")))


// Rotas

app.use('/admin', admin)

// Outros

const PORT = 3000
app.listen(PORT, () => {
    console.log("Server is running...")
})
