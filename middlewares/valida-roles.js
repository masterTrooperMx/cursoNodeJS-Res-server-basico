const {request, response} = require('express');

const User = require('../models/users');

const esAdminRol = (req = request, res = response, next) => {
    // viene de validaJWT
    if(!req.user) {
        return(res.status(500).json({
            msg: 'Loguearse de nuevo'
        }));
    }
    const { uid, rol } = req.user;
    try {
        // busca de la BD el usuario y almacenalo en req.usario
        //const registro = await User.findById(uid).exec();
        if( rol != 'ADMIN_ROL'){
            return(res.status(404).json({
                msg: 'Usuario sin privilegios'
            }));
        }
    } catch (error) {
        console.log(error);
        return(res.status(404).json({
            msg: 'Error BD'
        }));
    }
    next();
};

// vamos a aceptar la cantidad de roles que sea y regresaremos una funcion como middleware
const tieneRol = (... listaRoles) => {
    return((req = request, res = response, next) => {
        console.log(listaRoles);
        if(listaRoles.length < 1) {
            return(res.status(500).json({
                msg: 'Lista de roles vacia'
            }))
        }

        if(!req.user) {
            return(res.status(500).json({
                msg: 'Loguearse de nuevo'
            }));
        }

        const { uid, rol } = req.user;
        // ver si el rol guardado esta dentro de la lista permitida de roles empata
        let verRol = false;
        listaRoles.map(r => verRol = listaRoles.includes(rol));
        if(!verRol) {
            return(res.status(404).json({
                msg: 'Usuario sin privilegios'
            }));
        }

        next();
    });
};

module.exports = {
    esAdminRol,
    tieneRol
};