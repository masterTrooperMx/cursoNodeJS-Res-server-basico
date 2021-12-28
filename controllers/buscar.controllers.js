const {request, response} = require('express');
const {ObjectId}          = require('mongoose').Types;
const {User, Categoria, Producto}       = require('../models');

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'rols'
];

function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
};

const buscarUsuarios = async(termino = '',  res = response) => {
    const esMongoID = ObjectId.isValid(termino);
    // si el termino es un Id
    if(esMongoID) {
        const usuario = await User.findById(termino);
        if(!usuario){
            return res.status(404).json({
                msg: 'No se encontro el usuario de ese ID'
            });
        }
        res.status(200).json({
            results: [usuario]
        });
    }
    // si el termino es un email
    // if(validateEmail(termino)) {
    //     usuario = await User.find({email: termino}).exec();
    //     if(!usuario){
    //         return res.status(404).json({
    //             msg: 'No se encontro el usuario de ese ID'
    //         });
    //     }
    // } else {
    //     // es el nombre y vamos a buscar los que le queden
    //     const re = new RegExp(termino, 'i');
    //     usuario = await User.find({name: re}).exec();
    // }
    const re = new RegExp(termino, 'i');
    const usuario = await User.find({
                    $or: [{email: re}, {name: re}],
                    $and: [{state: true}]
                            }).exec();

    res.status(200).json({
        results: [usuario]
    });
};

const buscarCategorias = async(termino = '',  res = response) => {
    const esMongoID = ObjectId.isValid(termino);
    const term = termino.toUpperCase();
    // si el termino es un Id
    if(esMongoID) {
        const categoria = await Categoria.findById(termino);
        if(!categoria){
            return res.status(404).json({
                msg: 'No se encontro la categoria de ese ID'
            });
        }
        res.status(200).json({
            results: [categoria]
        });
    }
    const re = new RegExp(term, 'i');
    const categoria = await Categoria.find({
                    $or: [{name: re}],
                    $and: [{state: true}]
                            }).exec();

    res.status(200).json({
        results: [categoria]
    });
};

const buscarProductos = async(termino = '',  res = response) => {
    const esMongoID = ObjectId.isValid(termino);
    // si el termino es un Id
    if(esMongoID) {
        const producto = await Producto.findById(termino).populate('categoria','user');
        if(!producto){
            return res.status(404).json({
                msg: 'No se encontro el producto de ese ID'
            });
        }
        res.status(200).json({
            results: [producto]
        });
    }
    const re = new RegExp(termino, 'i');
    const producto = await Producto.find({
                    $or: [{name: re}],
                    $and: [{state: true}]
                            }).populate('categoria','user').exec();

    res.status(200).json({
        results: [producto]
    });
};

const buscar = (req = request, res = response) => {
    const {coleccion, termino} = req.params;
    console.log('buscando', coleccion);
    if( !coleccionesPermitidas.includes(coleccion) ) {
        return res.status(404).json({
            msg: 'no es una coleccion permitida'
        });
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
        case 'categorias':
            buscarCategorias(termino, res);
            break;
        case 'productos':
            buscarProductos(termino, res);
            break;
        case 'rols':
            break;
        default:
            break;
    }

    // res.status(200).json({
    //     coleccion,
    //     termino
    // });
};

module.exports = {
    buscar
}