const { response, request } = require('express');
const { json } = require('express/lib/response');

const User = require('../models/users');
const bcryptjs = require('bcryptjs');
const bcrypt = require('bcryptjs/dist/bcrypt');
const { generarJWT } = require('../helpers/jwt');

const authGet = (req =request, res = response) => {
    res.status(200).json({
        msg: 'Login-TST'
    });
};

const authLogin = async (req = request, res = response) => {
    const body = req.body;
    const {email, pass} = body;

    try {
        // verificar que el email existe
        const registro = await User.findOne({ email });
        if(!registro) {
            return(res.status(400).json({
                msg: 'Usuario/Pass fallo - email'
            }));
        }
        // verificar que el usuario esta activo
        if(!registro.state) {
            return(res.status(404).json({
                msg: 'Usuario/Pass fallo - estado'
            }));
        }
        // verificar la contraseña
        // const salt = bcryptjs.genSaltSync(10);
        // const a_pass = bcryptjs.hashSync(pass, salt);
        const a_pass = bcrypt.compareSync(pass, registro.pass);
        if( !a_pass ) {
            return(res.status(401).json({
                msg: 'Usuario/Pass fallo - pass'
            }));
        }
        // generar el JWT
        const token = await generarJWT(registro.id);

        res.status(201).json({
            registro,
            token
        });        
    } catch (error) {
        console.log(error);
        return( res.status(500).json({
            msg: 'Autenticacion fallo'
        }));
    }
};

module.exports = {
    authGet,
    authLogin
}