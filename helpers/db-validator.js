const Rol = require('../models/roles');
const {User, Categoria, Producto} = require('../models');

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

const categoriaExiste = async (categoria = '') => {
    // verifica que la descripcion de la categoria existe y regresa el id
    const cat = categoria.toUpperCase();
    const existeCategoria = await Categoria.findOne({ cat }).exec();
    if(!existeCategoria) {
        throw new Error('la categoria no existe');
    }
};

const idExiste = async (id = '') => {
    // verificar que el id existe en la BD
    const existeId = await User.findById(id).exec();
    if(!existeId) {
        throw new Error('no existe el ID en la tabla Usuarios');
    }
};

const idExisteC = async (id = '') => {
    // verificar que el id existe en la BD
    const existeId = await Categoria.findById(id).exec();
    if(!existeId) {
        throw new Error('no existe el ID en la tabla Categorias');
    }
}; 

const idExisteP = async (id = '') => {
    // verificar que el id existe en la BD
    const existeId = await Producto.findById(id).exec();
    if(!existeId) {
        throw new Error('no existe el ID en la tabla Productos');
    }
}; 

module.exports = {
    isValidRol,
    emailExiste,
    idExiste,
    idExisteC,
    idExisteP,
    categoriaExiste
};