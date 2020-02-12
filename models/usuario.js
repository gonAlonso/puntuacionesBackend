let mongoose = require('mongoose')
let Schema = mongoose.Schema

let UsuarioSchema = Schema({
    _id: {type: Schema.ObjectId, auto:true},
    nombre: String,
    email: {type: String, required:true},
    password:{type: String, required:true, min:4},
    sexo:{},
    activado: Boolean,
    puntuaciones: [{type: Schema.ObjectId, ref:'Score'}]
})

module.exports = mongoose.model('Users', UsuarioSchema)