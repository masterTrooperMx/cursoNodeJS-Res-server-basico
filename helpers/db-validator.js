const Rol = require('../models/roles');
const User = require('../models/users');

const isValidRol = async (rol = '') => {
    // verificar que el codeo existe, va a la BD y regreso uno si hay
    const existeRol = await Rol.findOne({rol}).exec();
    if(!existeRol){
        throw new Error('El rol no esta registrado en la BD');
    }
};

const emailExiste = async (email = '') => {
    // verificar que el codeo existe, va a la BD y regreso uno si hay
    const existeEmail = await User.findOne({email}).exec();
    if(existeEmail){
        // return res.status(400).json({
        //     msg: "el correo ya esta registrado"
        // });
        throw new Error('el correo ya esta registrado');
    }
};

const idExiste = async (id = '') => {
    // verificar que el id existe en la BD
    const existeId = await User.findById(id).exec();
    if(!existeId) {
        throw new Error('no existe el ID en la BD');
    }
};

module.exports = {
    isValidRol,
    emailExiste,
    idExiste
};