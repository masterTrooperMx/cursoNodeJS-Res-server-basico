const { response } = require('express');

const usersGet = (req, res = response) => {
    const {q = 'default', nombre = 'default'} = req.query;

    res.status(403).json({
        msg: 'get API - controlador',
        q,
        nombre
    });
};

const usersPost = (req, res = response) => {
    //const body = req.body;
    const {nombre, edad} = req.body;

    res.status(202).json({
        msg: 'post API - controlador',
        nombre,
        edad
    });
};

const usersPut = (req, res = response) => {
    const id = req.params.id;
    res.status(201).json({
        msg: 'put API - controlador',
        id
    });
};

const usersPatch = (req, res = response) => {
    res.status(500).json({
        msg: 'patch API - controlador'
    });
}

const usersDelete = (req, res = response) => {
    res.status(403).json({
        msg: 'delete API - controlador'
    });
}

module.exports = { 
    usersGet,
    usersPost,
    usersPut,
    usersPatch, 
    usersDelete
}