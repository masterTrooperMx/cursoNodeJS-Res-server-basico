const path                  = require('path');
const fs                    = require('fs');
const { response, request } = require('express');

const cloudinary = require('cloudinary').v2;
// const cloudinaryURL = 'cloudinary://'+
//                         process.env.CLOUDINARY_API +
//                         ':' +
//                         process.env.CLOUDINARY_KEY +
//                         '@' +
//                         process.env.CLOUD_NAME;
// cloudinary.config(cloudinaryURL);
const configCloudinary = { 
    cloud_name: `${process.env.CLOUD_NAME}`, 
    api_key: `${process.env.CLOUDINARY_KEY}`, 
    api_secret: `${process.env.CLOUDINARY_API}`
 };
 console.log(configCloudinary);
     cloudinary.config(configCloudinary);
/*     CLOUDINARY_URL=cloudinary://372795654971858:HvBfIx3m9-l0GVY6rfC-H86LV6c@cafetales1704
     */

const { subirArchivo }      = require('../helpers/uploads-validator');
const {User, Producto}      = require('../models/index.js');

const cargaArchivo = async (req, res = response) => {
    console.log(__dirname, req.files);
    // // from: https://github.com/richardgirges/express-fileupload/tree/master/example
    // if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    //     res.status(400).json({
    //         msg: 'No hay archivos que subir.'
    //     });
    //     return ;
    // };
    try {
        const pathCompleto = await subirArchivo(req.files, ['txt','md'], 'texts/');    
        res.status(200).json({
            pathCompleto
        });    
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: error
        });
    }
    
};

const actualizarImagen = async (req, res = response) => {
    const {id, coleccion} = req.params;
    const files = req.files;
    let modelo;
    // igual que el controlador simplificado
    switch (coleccion) {
        case 'usuarios':
            modelo = await User.findById(id);
            if(!modelo) {
                return res.status(400).json({
                    msg: `No existe el id:${id} en el modelo user`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe el id:${id} en el modelo productos`
                });
            }
            break;
        default:
            console.log(coleccion);
            return res.status(500).json({
                msg: `No se pudo validar esta categoria: ${coleccion}`
            });
    }
    
    // limpiar imagenes
    if(modelo.img) {
        // borrar la imagen del servidor
        const pathImagen = path.join(__dirname, '../public/uploads/', coleccion, modelo.img);
        if(fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen)
        }
    }

    try {
        const nomArch = await subirArchivo(files, undefined, `${coleccion}/`);
        modelo.img = nomArch;
        await modelo.save();
        res.status(200).json({
            id,
            coleccion,
            nomArch,
            modelo
        });            
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'Error de BD no se pudo actualizar la imagen'
        });   
    }
};

const actualizarImagenCloudinary = async (req, res = response) => {
    const {id, coleccion} = req.params;
    const files = req.files;
    let modelo;
    // igual que el controlador simplificado
    switch (coleccion) {
        case 'usuarios':
            modelo = await User.findById(id);
            if(!modelo) {
                return res.status(400).json({
                    msg: `No existe el id:${id} en el modelo user`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe el id:${id} en el modelo productos`
                });
            }
            break;
        default:
            console.log(coleccion);
            return res.status(500).json({
                msg: `No se pudo validar esta categoria: ${coleccion}`
            });
    }
    
    // limpiar imagenes
    if(modelo.img) {
        // borrar la imagen del servidor cloudinary
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split('.');
        cloudinary.uploader.destroy('public_id');
    }

    try {
        console.log(files.archivo);
        const {tempFilePath} = files.archivo;
        const resp = await cloudinary.uploader.upload(tempFilePath);
        const {secure_url} = resp;
        // const nomArch = await subirArchivo(files, undefined, `${coleccion}/`);
        modelo.img = secure_url;
        await modelo.save();
        res.status(200).json({
            id,
            coleccion,
            resp,
            modelo
        });            
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'Error de BD no se pudo actualizar la imagen'
        });   
    }
};

const muestraArchivo = async (req, res = response) => {
    const {id, coleccion} = req.params;
    const files = req.files;

    let modelo;
    const no_img = 'no-images.png';

    // igual que el controlador simplificado
    switch (coleccion) {
        case 'usuarios':
            modelo = await User.findById(id);
            if(!modelo) {
                const srcImagen = path.join(__dirname, '../assets/', no_img);
                res.status(400).sendFile(srcImagen);
                // return res.status(400).json({
                //     msg: `No existe el id:${id} en el modelo user`
                // });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                const srcImagen = path.join(__dirname, '../assets/', no_img);
                res.status(400).sendFile(srcImagen);
                // return res.status(400).json({
                //     msg: `No existe el id:${id} en el modelo productos`
                // });
            }
            break;
        default:
            console.log(coleccion);
            return res.status(500).json({
                msg: `No se pudo validar esta categoria: ${coleccion}`
            });
    }
    // mostrar imagen
    let imagen
    try {
        if(modelo.img) {
            imagen = modelo.img;
        } else {
            imagen = 'dummy_' + coleccion + '.jpeg';
        }
        const srcImagen = path.join(__dirname, '../public/uploads/', coleccion, imagen);
        res.status(200).sendFile(srcImagen);        
    } catch (error) {
        console.log(error);
        const srcImagen = path.join(__dirname, '../assets/', no_img);
        res.status(400).sendFile(srcImagen);
    }

};

module.exports = {
    cargaArchivo,
    actualizarImagen,
    actualizarImagenCloudinary,
    muestraArchivo
};