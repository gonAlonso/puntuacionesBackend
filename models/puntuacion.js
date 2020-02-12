let mongoose = require('mongoose')
let Schema = mongoose.Schema

let PuntuacionSchema = Schema({
    _id: {type: Schema.ObjectId, auto:true},
    valor: {type: Number, required: true},
    fecha: {type: Date, default: Date.now},
})

module.exports = mongoose.model('Score', PuntuacionSchema)