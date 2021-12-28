const {request, response} = require('express');
const { Categoria } = require('../models');

// muestra la lista de categorias paginadas
const categoriasGet = async (req = request, res = response) => { 
    // es opcional el limite como default 5
    const {limit = 5, from = 0} = req.query;
    // busca todas las categorias del Schema
    try {
        // se van a trabajar juntas las promesas en el bloque de codigo
        const [categorias, totalDocs] = await Promise.all([
            Categoria.find({ state : true })
                .populate('user')
                .skip(Number(from))
                .limit(Number(limit)) ,
            Categoria.countDocuments({ state : true })]
        );

        res.status(200).json({
             totalDocs,
             categorias
            //respBD
        });    
    } catch (error) {
        console.log(error);
        throw new Error('Problemas con el query en BD');
    }    
};

const categoriaGet = async (req = request, res = response) => {
    const id = req.params.id;

    try {
        // ya cuando llega aqui sabemos que existe el id en la tabla de Categorias
        const registro = await Categoria.findById(id).setOptions({
            state : true,
            populate: 'user'
        }).exec();
        if(!registro) {
            // no se encontro el registro
            return res.status(404).json({
                msg: 'No existe el ID en la tabla de la BD'
            });
        }
        res.status(200).json({
            msg : 'Categoria OK',
            registro
           //respBD
       });    
    } catch (error) {
        console.log(error);
        throw new Error('Problemas comunicacion en BD');        
    }
};

// crear categoria
const categoriasPost = async (req = request, res = response) => { 
    const body = req.body;
    const name = body.name.toUpperCase();
    const state =  true; //JSON.parse(body.state);
    const user = req.user._id;

    try {
        const registro = await Categoria.findOne({name});
        if(registro) {
            return res.status(400).json({
                msg: 'La categoria ya existe'
            });
        }
    } catch (error) {
        console.log(error);
        throw new Error('Problemas comunicacion en BD');
    }
    try {
        const categoria = new Categoria({name, state, user});

        await categoria.save(); // grabamos la tupla
        res.status(201).json({ 
            name,
            state,
            user
        });
    } catch (error) {
        console.log(error);
        throw new Error('Error de creacion en BD');
    }
};

// actualiza la categoria por medio del ID
const categoriasPut = async (req = request, res = response) => { 
    const id = req.params.id;
    const body = req.body;
    const name = body.name.toUpperCase();
    const user = req.user._id;

    try {
        // ya cuando llega aqui sabemos que existe el id en la tabla de Categorias
        const categoria = await Categoria.findByIdAndUpdate(id, {name, user});
        if(!categoria) { // el id es de mongo, pero no pudo actualizar la info
            return res.status(404).json({
                msg: 'No se pudo actualizar la categoria'
            });
        }
        // mensaje exito
        res.status(201).json({
            msg: 'Categoria actualizada correctamente actualizado correctamente',
            id,
            name
        });    
    } catch (error) {
        console.log(error);
        throw new Error('Error en consulta de BD');
    }
};

const categoriasDelete =  async(req = request, res = response) => { 
    const id = req.params.id;
    // vamos a poner state = false

    try {
        const registro = await Categoria.findByIdAndUpdate(id, {state: false}, {new: true});
        // mensaje de exito
        res.status(202).json({
            registro,
            uid : id
        });
    } catch (error) {
        console.log(error);
        throw new Error('Error en consulta de BD');        
    }
};

module.exports = {
    categoriasGet,
    categoriaGet,
    categoriasPost,
    categoriasPut,
    categoriasDelete
};