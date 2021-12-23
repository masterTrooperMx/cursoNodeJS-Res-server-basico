const { response, request } = require('express');
const User = require('../models/users');
const bcryptjs = require('bcryptjs');


const usersGet = async (req = request, res = response) => {
    // es opcional el limite como default 5
    const {limit = 5, from = 0} = req.query;
    // busca todos los usuarios del Schema
    try {
        // dentro de find se manda el filtro con la condicion estado: true
        // const usuarios = await User.find({ state : true })
        // .skip(Number(from))
        // .limit(Number(limit));

        // const totalDocs = await User.countDocuments({ state : true });
        // se van a trabajar juntas las promesas en el bloque de codigo
        const [usuarios, totalDocs] = await Promise.all([
            User.find({ state : true })
                .skip(Number(from))
                .limit(Number(limit)) ,
            User.countDocuments({ state : true })]
        );

        res.status(200).json({
             totalDocs,
             usuarios
            //respBD
        });    
    } catch (error) {
        throw new Error('No existen usuarios que mostrar en la BD');
    }
    
};
// we pass user conformance and user existance
const usersPost = async (req, res = response) => {
    const body = req.body;
    const {name, email, pass, rol} = body;
    //const user = new User(body); // creamos la instancia = tupla
    const user = new User({name, email, pass, rol});  
    // hacer el hash del pass
    const salt = bcryptjs.genSaltSync(10);
    user.pass = bcryptjs.hashSync(pass, salt);

    try {
        await user.save(); // grabamos la tupla
    } catch (error) {
        console.log(error);
        throw new Error('faltan campos o valores a insertar');
    }

    res.status(202).json({
        user
    });
};

const usersPut = async (req = request, res = response) => {
    const id = req.params.id;
    const body = req.body;
    // vamos a retirar las variables que no deseamos que se actualicen en el servicio PUT
    const {_id, pass, google, ...resto } = body;

    // validar contra BD la existencia del id
    if( pass ) {
        // hacer el hash del pass
        const salt = bcryptjs.genSaltSync(10);
        resto.pass = bcryptjs.hashSync(pass, salt);
        // retrieve pass
    }

    try {
        const user = await User.findByIdAndUpdate(id, resto);
        res.status(201).json({
            msg: 'put API - usuario actualizado',
            user
        });    
    } catch (error) {
        throw new Error(`No existe el id: ${id} en la BD, ${error}`);
    }
};

const usersPatch = (req, res = response) => {
    res.status(500).json({
        msg: 'patch API - controlador'
    });
};

const usersDelete = async (req = request, res = response) => {
    const id = req.params.id;
    // despues de crear token
    const uid = req.uid;
    const a_user = req.user;
    try {
        // borrandolo logicamente
        const user = await User.findByIdAndUpdate(id, {state: false});
        res.status(403).json({
            user,
            uid,
            a_user
        });
    } catch (error) {
        throw new Error('No se puede borrar el usuario');
    }
};

module.exports = { 
    usersGet,
    usersPost,
    usersPut,
    usersPatch, 
    usersDelete
};