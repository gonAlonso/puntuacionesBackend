const Usuario  = require('../models/usuario')
const Puntuacion  = require('../models/puntuacion')
const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const mongoose  = require('mongoose')
const jwt = require('jsonwebtoken')

const schemaRegister = Joi.object({
    nombre: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    //repeat_password: Joi.ref('password'),
    email: Joi.string().email()//{ minDomainSegments: 2, tlds: { allow: ['es','com', 'net'] } })
})

const schemaLogin = Joi.object({
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    email: Joi.string().email()//{ minDomainSegments: 2, tlds: { allow: ['es','com', 'net'] } })
})

async function getAll(req, res) {

    try {
        let usuarios = await Usuario.find()
        res.status(200).send({accion:'get all', datos: usuarios})
    }
    catch(e){
        res.status(500).send({accion:'get all', mensaje: `Error al obtener los usuarios ${e}`})
    }
}


async function getById(req, res) {
    let id = req.params.id
    try {
        let usuario = await Usuario.findById(id)
        res.status(200).send({accion:'get by id', datos: usuario})
    }
    catch(e){ res.status(500).send({accion:'get by id', mensaje: `Error al obtener el usuario ${e}`}) }
}

async function register(req, res) {
    try {
        const {error, value} = await schemaRegister.validateAsync( req.body )
    }
    catch(e){
        return res.status(400).send({accion:'register', mensaje: `Error al validar los datos del usuario ${e}`})
    }

    let usuarioEncontrado = await Usuario.findOne( {email: req.body.email } )

    if( usuarioEncontrado ){
        return res.status(400).send({accion:'register', mensaje: `Error al registrar el usuarios: el Usuario ya existe`})
    }

    const salt = await bcrypt.genSalt(10)
    const pwdEncriptado = await bcrypt.hash( req.body.password, salt)

    var usuario = new Usuario( req.body )
    usuario.password = pwdEncriptado
    usuario._id = undefined
    try {
        let usuarioGuardado = await usuario.save()
        res.status(200).send({accion:'register', datos: usuarioGuardado})
    }
    catch(e){ res.status(500).send({accion:'register', mensaje: `Error al registrar el usuario ${e}`}) }
}


async function login(req, res){ // Usaremos JsonWebToken
    // Validar campos
    try {
        if (( req.body.email == undefined ) ||
            ( req.body.password == undefined ))
            throw new Exception("null")
        const {error, value} = await schemaLogin.validateAsync( req.body )
    }
    catch(e){
        return res.status(400).send({accion:'login', mensaje: `Error 1 al validar email/password`})
    }

    // Comprobar si usuario existe
    let usuarioEncontrado = await Usuario.findOne( {email: req.body.email } )
    if( !usuarioEncontrado )
        return res.status(500).send({accion:'login', mensaje: `Error 2 al validar el email/password`})
    
    // Comprobar si pwd coincide
    const pwdOK = await bcrypt.compare( req.body.password, usuarioEncontrado.password )
    if( !pwdOK)
        return res.status(500).send({accion:'login', mensaje: `Error 3 al validar el email/password`})
    
    // Crear y devolver token
    const token = jwt.sign({
        _id: usuarioEncontrado._id,
        saludo: 'Hola',
        exp: Math.floor( Date.now() / 1000) + 3600
    }, process.env.TOKEN_SECRETO)

    res.header('auth-token', token)
    res.status(200).send(token)
    //res.status(200).send({accion:'login', token: token})
}

async function remove(req, res) {
    let usuarioId = req.params.id
    try {
        let resp = await Usuario.findByIdAndDelete(usuarioId)
        if(!resp){
            res.status(500).send({ accion: "delete", mensaje:"Error: no existe el ID del usuario a borrar"})
            console.log("Error 1")
        }
        res.status(200).send({ accion: "delete", datos : resp})
        console.log("OK")
    }
    catch(e) { res.status(500).send({ accion: "delete", mensaje:"Error al borrar el usuario "+e}) ; console.log("Error 2")}
}

async function update (req, res) {
    let usuarioId = req.params.id
    var datos = req.body;
    try {
        let result = await Usuario.findByIdAndUpdate(usuarioId, datos)
        if(!result)
            return res.status(500).send({ accion: "delete", mensaje:"Error: no existe el ID del usuario a actualizar"}) 
        res.status(200).send({ accion: "update", datos : res})
    }
    catch(e){
        res.status(500).send({ accion: "update", mensaje:"Error al actualizar el usuario: "+e})
    }
}

async function getPuntuacionesUsr(req, res){
    try {
        let usuario = await Usuario.findById( req.params.id ).populate('puntuaciones')
        if( !usuario ) return res.status(500).send({accion:'login', mensaje: `Error 1 al buscar puntuaciones`})
        res.status(200).send({ accion: "update", datos : usuario })
    }
    catch(e){
        res.status(500).send({ accion: "update", mensaje: "Error al obtener las puntuaciones del usuario: " +e})
    }
}

async function insertaPuntuacion(req, res){
    const session = await mongoose.startSession()
    let puntuacion = new Puntuacion( req.body )
    try {
        session.startTransaction()
        let puntuacionGuardada = await puntuacion.save()
        let usuarioEncontrado = await Usuario.findById( req.params.id )
        usuarioEncontrado.puntuaciones.push( puntuacionGuardada )
        await usuarioEncontrado.save()
        await session.commitTransaction()
        res.status(200).send({ accion: "save", mensaje:"Puntuacion guardada"})
    } catch(e) {
        await session.abortTransaction()
        res.status(500).send({ accion: "save", mensaje:"Error al guardar la puntuacion"})
    } finally {
        session.endSession()
    }
}


module.exports = {
    getAll,
    getById,
    register,
    remove,
    update,
    login,
    insertaPuntuacion,
    getPuntuacionesUsr
}