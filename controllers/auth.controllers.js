const { response, request } = require('express');
const { json } = require('express/lib/response');

const bcryptjs = require('bcryptjs');
const bcrypt = require('bcryptjs/dist/bcrypt');
// modelos
const User = require('../models/users');
// helpers
const { generarJWT } = require('../helpers/jwt-validador');
const { googleVerify} = require('../helpers/google-validador');

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

const googleSignIn = async (req = request, res = response) => {
    const {id_token} = req.body;

    console.log('google_token:',id_token);
    try {
        const google_user = await googleVerify(id_token);
        const {name, img, email} = google_user;
        // verificar que el email existe
        let registro = await User.findOne({ email });
        // puede ser que el usuario exista y que no, si no existe lo creamos y si ya existe lo verificamos
        if(!registro) {
            const data = {
                name,
                email,
                pass : ':P',
                img,
                rol : 'USER_ROL',
                google : true
            };
            // el usuario no existe en la BD
            const user = new User(data);
            await user.save(); // grabamos la tupla
            console.log('usuario creado por google');
        }
        // usuario borrado?
        if(!registro.state) {
            return(res.status(401).json({
                msg: 'Usuario bloqueado'
            }));
        }
        // generar el JWT
        const token = await generarJWT(registro.id);

        res.json({
            id_token,
            google_user
        });            
    } catch (error) {
        res.status(400).json({
            msg: 'el token es invalido'
        });
    }
};

module.exports = {
    authGet,
    authLogin,
    googleSignIn
}