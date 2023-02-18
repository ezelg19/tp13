const { Schema, model } = require("mongoose")

const schema = new Schema({
    email: { type: String, max: 100, required: true },
    name: { type: String, max: 100, required: true },
    direccion: { type: String, max: 2000 },
    edad: { type: Number, max: 100 },
    numTel: { type: Number, max: 999999999999 },
    avatar: { type: String, max: 20000 },
    password: { type: String, max: 99999 },
    carrito: [{type: Number}]
})

module.exports = model('author', schema)
