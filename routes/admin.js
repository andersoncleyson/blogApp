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
    Categoria.find().sort({date:'desc'}).then((categories) => {
        res.render("admin/categories", {categories: categories.map(categories => categories.toJSON())})
    }).catch((err) => {
        req.flash("erro_msg", "Houve um erro ao listar as categorias")
        res.redirect("/admin")
    })
    
})

router.post("/categories/nova", (req, res) => {
    
    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({text: "Nome inválido"})
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({text: "Slug inválido"})
    }

    if(req.body.nome.length < 2){
        erros.push({text: "Nome da categoria muito pequeno"})
    }

    if(erros.length > 0){
        res.render("admin/addcategorias", {erros: erros})
    }else{
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }

        new Categoria(novaCategoria).save().then(() => {
            req.flash("success_msg", "Categoria criada com sucesso!")
            res.redirect("/admin/categories")
        }).catch((err) => {
            req.flash("error_msg", "Houve algum erro ao salvar a categoria")
            res.redirect("/admin")
        })
    } 
})

router.get("/categories/edit/:id", (req, res) => {
    Categoria.findOne({_id:req.params.id}).then((categories) => {
        res.render("admin/editCategories", {categories: categories.toJSON()})
    }).catch((err) => {
        req.flash("error_msg", "Esta categoria não existe")
        res.redirect("/admin/categories")
    })
    
})

router.post("/categories/edit", (req, res) => {
    Categoria.findOne({_id: req.body.id}).then((categories) => {

        var erros = []

        if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
            erros.push({text: "Nome inválido"})
        }

        if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
            erros.push({text: "Slug inválido"})
        }

        if(req.body.nome.length < 2){
            erros.push({text: "Nome da categoria muito pequeno"})
        }

        if(erros.length > 0){
            res.render("admin/editCategories", {erros: erros, categories: categories.toJSON()})
        }else{
            categories.nome = req.body.nome
            categories.slug = req.body.slug

            categories.save().then(() => {

                req.flash("success_msg", "Categoria editada com sucesso")
                res.redirect("/admin/categories")
            }).catch((err) => {
                req.flash("error_msg", "Houve um erro interno ao salvar a edição da categoria")
                res.redirect("/admin/categories")
            }) 
        }
       
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao editar a categoria" + err)
        res.redirect("/admin/categories")
    })
})

module.exports = router