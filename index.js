var express = require('express')
var bodyParser = require('body-parser')

var app = express()
app.use( bodyParser.urlencoded( {extended:false} ))
app.use( bodyParser.json() )


// Routes
app.get("/", (req, res)=>{
    res.status(200).send("API test OK")
})

app.get("/puntuaciones", (req, res)=>{
    //TODO: Leer de la base de datos
    let datosJSON = {
        accion: 'get all',
        datos: [
            {nombre : "Pepe", puntuacion:33},
            {nombre : "Bea", puntuacion:23},
            {nombre : "Felix", puntuacion:29}
        ]
    }
    res.status(200).send( datosJSON )
})

app.post("/puntuacion", (req, res)=>{
    var datos = req.body;
    console.log( "Nuevos datos ", datos)
    //TODO: insertar en la base de datos
    let datosRespuesta = {
        accion: "save",
        datos : datos
    }
    res.status(200).send(datosRespuesta)
})

app.delete("/puntuacion/:id", (req, res)=>{
    let puntucacionId = req.params.id
    let datosRespuesta = {
        accion: "delete",
        datos : puntucacionId
    }
    res.status(200).send( datosRespuesta )
})

app.listen(5200, ()=>{
    console.log("API REST funcionando en localhost")
})