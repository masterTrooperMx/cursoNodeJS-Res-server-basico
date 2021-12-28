const {request, response} = require('express');
const { Categoria, Producto } = require('../models');

// obtener todos los productos con sus categorias - publico
const productosGet = async (req = request, res = response) => {
    // es opcional el limite como default 5
    const {limit = 5, from = 0} = req.query;
    // busca todos los productos del Schema
    try {
        // se van a trabajar juntas las promesas en el bloque de codigo
        const [productos, totalDocs] = await Promise.all([
            Producto.find({ state : true })
                .populate('user')
                .populate('categoria')
                .skip(Number(from))
                .limit(Number(limit)) ,
            Producto.countDocuments({ state : true })]
        );

        res.status(200).json({
             totalDocs,
             productos
            //respBD
        });    
    } catch (error) {
        console.log(error);
        throw new Error('Problemas con el query en BD');
    }
};
// obtener la info de un producto con su categoria - publico
const productoGet = async (req = request, res = response) => {
    const id = req.params.id;

    try {
        // ya cuando llega aqui sabemos que existe el id en la tabla de Productos
        const registro = await Producto.findById(id).setOptions({
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
// crear un producto con categoria existente - usuario con token - privado
const productoPost = async (req = request, res = response) => {
    // hasta aqui todos los valores requeridos se revisan, user es MONGO, CAT es cadena conv a MONGO
    // valores para crear el producto
    const body = req.body;
    // tratamiento del valor de las variables
    const name  = body.name.toLowerCase();
    const desc  = body.desc.toLowerCase();
    const cat   = body.cat.toUpperCase();
    const disp  = JSON.parse(body.disp);
    const state = JSON.parse(body.state);
    const price = JSON.parse(body.price);

    // del JWT obtener el id del usuario
    const user = req.user._id;
    let catId = '';
    // verificar que esta descripcion no exista ya
    try {
        const registro = await Producto.findOne({ name }).exec();
        if(registro) {
            return res.status(409).json({
                msg: 'La descripcion del producto ya existe'
            });
        }
    } catch (error) {
        console.log(error);
        throw new Error('Error en consulta de BD');        
    }
    // de la categoria obtener el id de categoria
    try {
        const categoria = await Categoria.findOne({ name : cat }).exec();
        console.log({categoria});
        if(!categoria) {
            return(res.status(404).json({
                msg: 'La descripcion de la categoria no existe en la BD'
            }));
        }
        catId = categoria._id;
    } catch (error) {
        console.log(error);
        throw new Error('Error en consulta de BD');
    }
    // generar el data que se va a grabar con lo que se tiene 
    const data = {
        name,
        state,
        user,
        price, 
        categoria: catId,
        disp
    };
    if(desc) { data.desc = desc; }

    try {
        const producto = new Producto(data);
        // grabar el data
        await producto.save(); // grabamos la tupla
        
        res.status(202).json({
            msg: 'creacion exitosa',
            name,
            cat,
            catId,
            user,
            desc,
            disp,
            state,
            price    
        });
    } catch (error) {
        console.log(error);
        throw new Error('Error en creacion producto de BD');        
    }
};
// actualiza un producto y modifica su categoria (no crea) - usuario con token - privado
const productoPut = async (req = request, res = response) => {
    // ya viene revisado que el id existe en Productos
    const id = req.params.id;
    // valores para acutalizar el producto
    const body = req.body;
    // tratamiento del valor de las variables
    // captura los campos requeridos, ya existe la categoria nueva/actual
    const name  = body.name.toLowerCase();
    const desc  = body.desc.toLowerCase();
    const cat   = body.cat.toUpperCase();
    const disp  = JSON.parse(body.disp);
    const state = JSON.parse(body.state);
    const price = JSON.parse(body.price);
    // del JWT obtener el id del usuario
    const user = req.user._id;
    // si cambia la categoria no importa ya se reviso
    let catId = '';
    try {
        const categoria = await Categoria.findOne({ name : cat }).exec();
        console.log({categoria});
        if(!categoria) {
            return(res.status(404).json({
                msg: 'La descripcion de la categoria no existe en la BD'
            }));
        }
        catId = categoria._id;
    } catch (error) {
        console.log(error);
        throw new Error('Error en consulta de BD');
    }
    // formamos la data a actualizar
    const data = {
        name,
        state,
        user,
        price, 
        categoria: catId,
        disp
    };
    if(desc) { data.desc = desc; }

    try {
        const producto = await Producto.findByIdAndUpdate(id, data);
        if(!producto) { // el id es de mongo, pero no pudo actualizar la info
            return res.status(404).json({
                msg: 'No se pudo actualizar el producto'
            });
        }

        res.status(202).json({
            msg: 'actualizacion exitosa',
            id,
            name,
            cat,
            catId,
            user,
            desc,
            disp,
            state,
            price    
        });
    } catch (error) {
        console.log(error);
        throw new Error('Error en actualizacion producto de BD');        
    }    
};
// borra logicamente un producto - usuario con rol ADMIN_ROL - privado
const productoDelete = async (req = request, res = response) => {
    const id = req.params.id;
    // vamos a poner state = false

    try {
        const registro = await Producto.findByIdAndUpdate(id, {state: false}, {new: true});
        // mensaje de exito
        res.status(202).json({
            msg: 'borrado logico exitoso',
            registro,
            uid : id
        });
    } catch (error) {
        console.log(error);
        throw new Error('Error en consulta de BD');        
    }
};

module.exports = {
    productosGet,
    productoGet,
    productoPost,
    productoPut,
    productoDelete
};