const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema({
    nome:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

mongoose.model("user", User)