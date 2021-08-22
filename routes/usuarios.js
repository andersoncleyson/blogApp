const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
require("../models/User")

const User = mongoose.model("user")

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

    if(!req.body.password.length < 4){
        erros.push({texto: "Senha muito curta"})
    }

    if(req.body.senha != req.body.senha2){
        erros.push({texto: "As senhas não batem! Tente novamente."})
    }

    if(erros.length > 0){
        res.render("/usuarios/registro", {erros: erros})
    }else{
        
    }


})

module.exports = router