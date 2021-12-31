const { Router } = require('express');
const {request, response} = require('express');
const {check} = require('express-validator');

const router = Router();
// controllers
const { 
    cargaArchivo,
//    actualizarImagen,
    muestraArchivo,
    actualizarImagenCloudinary
} = require('../controllers/uploads.controllers');
// middlewares
const { validaCampos, valida_uploads } = require('../middlewares');
// helpers
const { coleccioneasPermitidas } = require('../helpers/db-validator');
// {{url}}/uploads
// CRUD
// muestra las imagenes del los productos
router.get('/:coleccion/:id', [
                check('id','El id debe ser de Mongo').isMongoId(),
                check('coleccion').custom(c => coleccioneasPermitidas(c, ['usuarios','productos'])),
                validaCampos
             ], muestraArchivo);
// subir el archivo nuevo en la ruta determinada, solo subir archivos a las rutas predeterminadas
router.post('/', valida_uploads, cargaArchivo);
// para subir imagenes de productos
router.put('/:coleccion/:id', [
                check('id','El id debe ser de Mongo').isMongoId(),
                check('coleccion').custom(c => coleccioneasPermitidas(c, ['usuarios','productos'])),
                valida_uploads,
                validaCampos
            ], actualizarImagenCloudinary);
//        ], actualizarImagen);

module.exports = router;