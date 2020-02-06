var express = require('express')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var routerPuntuacion = require('./routes/puntuacion')
var cors = require('cors')
var morgan = require('morgan')
var dotenv = require('dotenv')
var app = express()

dotenv.config()
app.use( bodyParser.urlencoded( {extended:false} ))
app.use( bodyParser.json() )

app.use(cors())
app.use(morgan('dev'))

// Routes
app.get("/", (req, res)=>{ res.status(200).send("API test OK") })

// Todas las rutas que empiecen por /puntuacion se redirige al enrutador
app.use('/puntuacion', routerPuntuacion )

const run = async()=> {
    await mongoose.connect(process.env.URL_BASE_DATOS,
        { useNewUrlParser: true , useUnifiedTopology: true})
    await app.listen(process.env.PUERTO_SERVIDOR)
    console.log("API REST funcionando en localhost:" + process.env.PUERTO_SERVIDOR)
}

run().catch(err=> console.error(`Fallo al arrancar servidor: ${err}`))