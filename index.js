var express = require('express')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var Puntuacion  = require('./models/puntuacion')

var app = express()
app.use( bodyParser.urlencoded( {extended:false} ))
app.use( bodyParser.json() )


var PUERTO = 5200

// Routes
app.get("/", (req, res)=>{
    res.status(200).send("API test OK")
})

app.get("/puntuaciones", (req, res)=>{
    Puntuacion.find().exec((err, puntuaciones)=>{
        if(err) { res.status(500).send({accion:'get all', mensaje: 'Error al obtenet las puntuaciones'})}
        else { res.status(200).send({accion:'get all', datos: puntuaciones}) }
    })
})

app.post("/puntuacion", (req, res)=>{
    var datos = req.body;
    var puntuacion = new Puntuacion()
    puntuacion.nombre = datos.nombre
    puntuacion.puntuacion = datos.puntuacion
    puntuacion.save((err, result)=>{
        if(err) { res.status(500).send({ accion: "save", mensaje:"Error al guardar la puntuacion"})}
        else { res.status(200).send({ accion: "save", datos : result})}
    })
})

app.delete("/puntuacion/:id", (req, res)=>{
    let puntuacionId = req.params.id
    Puntuacion.findByIdAndDelete(puntuacionId,(err, result)=>{
        if(err) { res.status(500).send({ accion: "delete", mensaje:"Error al borrar la puntuacion"})}
        else if(!result) { res.status(404).send({ accion: "delete", mensaje:"Error, no existe la puntuacion"})}
        else { res.status(200).send({ accion: "delete", datos : result})}
    })
})

mongoose.connect('mongodb://localhost:27017/scores', (err, res)=>{
    if(err) {
        console.log("Error de conexion a la base MongoDB")
        throw err
    }
     console.log("Conectado con la base MongoDB")
     
    app.listen(PUERTO, ()=>{
        console.log("API REST funcionando en localhost:" + PUERTO)
    })
})
        
