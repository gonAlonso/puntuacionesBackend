let mongoose = require('mongoose')
let Schema = mongoose.Schema

let PuntuacionSchema = Schema({
    _id: {type: Schema.ObjectId, auto:true},
    nombre: String,
    puntuacion: Number,
})

module.exports = mongoose.model('Score', PuntuacionSchema)