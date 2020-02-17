const controller = require('../controller/usuario')
const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const verificacion = require('./verificacionToken')

//router.get("/", verificacion.validarToken, controller.getAll )
router.get("/", controller.getAll )
router.get("/:id", verificacion.validarToken, controller.getById )
router.post("/", controller.register )
router.delete("/:id", verificacion.validarToken, controller.remove )
router.put("/:id", verificacion.validarToken, controller.update )
router.post("/:id/puntuacion", controller.insertaPuntuacion )   // Añadir puntuiacin a usuario particular
router.get("/:id/puntuacion", controller.getPuntuacionesUsr )   // obtener puntuacion de usuario particular
// Borrar puntuacion de usuario particular
router.post("/login", controller.login )

module.exports = router
