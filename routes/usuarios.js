const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
require("../models/User")

const User = mongoose.model("user")

const bcrypt = require("bcryptjs")

router.get("/registro", (req, res) => {
    res.render("usuarios/registro")
})

router.post("/registro", (req, res) => {
    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido"})
    }

    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({texto: "Email inválido"})
    }

    if(!req.body.password || typeof req.body.password == undefined || req.body.password == null){
        erros.push({texto: "Senha inválida"})
    }

    if(req.body.password.length < 4){
        erros.push({texto: "Senha muito curta"})
    }

    if(req.body.password != req.body.password2){
        erros.push({texto: "As senhas não batem! Tente novamente."})
    }

    if(erros.length > 0){
        res.render("/usuarios/registro", {erros: erros})
    }else{
        User.findOne({email: req.body.email}).then((usuario) => {
            if(usuario){
                req.flash("error_msg", "já existe uma conta com esse email.")
                res.redirect("/usuarios/registro")
            }else {
                const novoUsuario = new User({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha

                })

                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                        if(erro){
                            req.flash("error_msg", "Houve um erro durante o cadastro do usuários")
                            res.redirect("/")
                        }

                        novoUsuario.senha = hash

                        novoUsuario.save().then(() => {
                            req.flash("success_msg", "Usuário criado com sucesso!")
                            res.redirect("/")
                        }).catch((err) => {
                            req.flash("error_msg", "Houve um erro ao criar o usuário, tente novamente!")
                            res.redirect("/")
                        })

                    })
                })
            }
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro")
            res.redirect("/")
        })
    }


})

module.exports = router