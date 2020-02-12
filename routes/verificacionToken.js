const jwt = require('jsonwebtoken')

exports.validarToken = (req, res, next) => {
    const token = req.header('auth-token')
    if(!token) return res.status(401).send("Acceso no autorizado 1")
    
    try{
        const verificado = jwt.verify(token, process.env.TOKEN_SECRETO)
        console.log(verificado)
    }
    catch(e) {
        return res.status(400).send("Acceso no autorizado 2")
    }
    next()
}
