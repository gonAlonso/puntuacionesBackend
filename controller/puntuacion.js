var Puntuacion  = require('../models/puntuacion')

async function getAll(req, res) {
    /*
    Puntuacion.find().exec((err, puntuaciones)=>{
        if(err) { res.status(500).send({accion:'get all', mensaje: 'Error al obtenet las puntuaciones'})}
        else { res.status(200).send({accion:'get all', datos: puntuaciones}) }
    })
    */
   /*
   Puntuacion.find().exec()
        .then(p=>res.status(200).send({accion:'get all', datos: p}))
        .catch(err=>res.status(500).send({accion:'get all', mensaje: `Error al obtenet las puntuaciones ${err}`}))
    */
   // Async/ Await
    try {
        let puntuaciones = await Puntuacion.find()
        res.status(200).send({accion:'get all', datos: puntuaciones})
    }
    catch(e){
        res.status(500).send({accion:'get all', mensaje: `Error al obtener las puntuaciones ${e}`})
    }
}


async function getById(req, res) {
    let id = req.params.id
    try {
        let puntuacion = await Puntuacion.findById(id)
        res.status(200).send({accion:'get by id', datos: puntuacion})
    }
    catch(e){ res.status(500).send({accion:'get by id', mensaje: `Error al obtener la puntuacion ${e}`}) }
}

async function insert(req, res) {
    var puntuacion = new Puntuacion( req.body )
    try {
        let puntuaciones = await puntuacion.save()
        res.status(200).send({accion:'save', datos: puntuaciones})
    }
    catch(e){ res.status(500).send({accion:'save', mensaje: `Error al guardar la puntuacion ${e}`}) }
}

async function remove(req, res) {
    let puntuacionId = req.params.id
    try {
        let res = await Puntuacion.findByIdAndDelete(puntuacionId)
        if(!res) { res.status(500).send({ accion: "delete", mensaje:"Error: no existe el ID a borrar"}) }
        else  res.status(200).send({ accion: "delete", datos : res})
    }
    catch(e){ 
        res.status(500).send({ accion: "delete", mensaje:"Error al borrar la puntuacion"})
    }
}

async function update (req, res) {
    let puntuacionId = req.params.id
    var datos = req.body;
    try {
        let res = await Puntuacion.findByIdAndUpdate(puntuacionId, datos)
        if(!res) { res.status(500).send({ accion: "delete", mensaje:"Error: no existe el ID a borrar"}) }
        res.status(200).send({ accion: "update", datos : res})
    }
    catch(e){
        res.status(500).send({ accion: "update", mensaje:"Error al actualizar la puntuacion"})
    }
}

module.exports = {
    getAll,
    getById,
    insert,
    remove,
    update
}