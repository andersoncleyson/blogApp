
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

require("./models/Postagem")

const Postagem = mongoose.model("postagens")

require("./models/Categoria")

const Categoria = mongoose.model("categories")

const users = require("./routes/usuarios")

const moment = require('moment')

const db = require("./config/db")

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
app.engine('handlebars', handlebars({
    defaultLayout: 'main',
    helpers:{
        formatDate: (date) => {
            return moment(date).format('DD/MM/YYYY')
        }
    }
    }))
app.set('view engine', 'handlebars')

// Mongoose
mongoose.Promise = global.Promise;
mongoose.connect(db.mongoURI).then(() => {
    console.log("Server connected")
}).catch((err) => {
    console.log("connect fail" + err)
})

//Public
app.use(express.static(path.join(__dirname,"public")))


// Rotas

app.get("/", (req, res) => {
    Postagem.find().lean().populate("categories").sort({data: "desc"}).then((postagens) => {
        res.render("index", {postagens: postagens})
        
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro interno")
        res.redirect("/404")
    })
    
})

app.get("/postagem/:slug", (req, res) => {
    Postagem.findOne({slug: req.params.slug}).lean().then((postagem) => {
        if(postagem){
            res.render("postagem/index", {postagem: postagem})
        }else{
            req.flash("error_msg", "Esta postagem não existe")
            res.redirect("/")
        }
    }).catch((err) => {
        req.flash("error_msg", "houve um erro" + err)
        res.redirect("/")
    })
})

app.get("/404", (req, res) => {
    res.send('Erro 404')
})

app.get("/categorias", (req, res) => {
    Categoria.find().lean().then((categories) => {
        res.render("categorias/index", {categories: categories})
    }).catch((err) => {
        req.flash("error_msg", "Houve algum erro" + err)
        res.redirect("/")
    })
})

app.get("/categorias/:slug", (req, res) => {
    Categoria.findOne({slug: req.params.slug}).lean().then((categoria) => {
        if(categoria){
            Postagem.find({categoria: categoria._id}).then((postagens) => {
                res.render("categorias/postagens", {postagens: postagens.map(Categoria => Categoria.toJSON())})
            }).catch((err) => {
                req.flash("error_msg", "Houve um erro" + err)
                res.redirect("/")
            })
        }else{
            req.flash("error_msg", "Esta categoria não existe")
            res.redirect("/")
        }
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro interno" + err)
        res.redirect("/")
    })
})

app.use('/admin', admin)
app.use('/usuarios', users)

// Outros

const PORT = process.env.PORT || 8089
app.listen(PORT, () => {
    console.log("Server is running...")
})
