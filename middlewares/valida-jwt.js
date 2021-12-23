const jwt = require('jsonwebtoken');
const {request, response} = require('express');

const User = require('../models/users');

const validaJWT = async (req = request, res = response, next) => {
    const token = req.header('x-token');
    console.log('Token: ',token);
    // validacion
    if(!token) {
        return(res.status(401).json({
            msg: 'Token no presente'
        }));
    }
    try {
        const privateKey = process.env.SECRETORPRIVATEKEY;
        const {uid, iat, exp} = jwt.verify(token, privateKey);
        console.log(uid);
        req.uid = uid;
        // busca de la BD el usuario y almacenalo en req.usario
        const registro = await User.findById(uid).exec();
        if(!registro) {
            return(res.status(404).json({
                msg: 'No existe usuario con uid'
            }));
        }

        const state = registro.state;
        if(!state) {
            return(res.status(401).json({
                msg: 'Usuario borrado'
            }));
        }
        req.user = registro;

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token invalido'
        });
    }
};

module.exports = {
    validaJWT
}