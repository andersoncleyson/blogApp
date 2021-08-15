const express = require("express")

const router = express.Router()

const mongoose = require("mongoose");

require("../models/Categoria")

const Categoria = mongoose.model("categories")

router.get('/', (req, res) => {
    res.render("admin/index")
})

router.get('/posts', (req, res) => {
    res.send("Página de posts")
})

router.get("/categories/add", (req, res) => {
    res.render("admin/addcategorias")
})

router.get('/categories', (req, res) => {
    res.render("admin/categories")
})

router.post("/categories/nova", (req, res) => {
    const novaCategoria = {
        nome: req.body.nome,
        slug: req.body.slug
    }

    new Categoria(novaCategoria).save().then(() => {
        console.log("Categoria salva com sucesso")
    }).catch((err) => {
        console.log("Erro ao salvar categoria" + err)
    })
})

module.exports = router