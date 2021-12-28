const { Router } = require('express');
const {request, response} = require('express');
const {check} = require('express-validator');

const router = Router();
// controllers
const { 
    productosGet,
    productoGet,
    productoPost,
    productoPut,
    productoDelete
} = require('../controllers/productos.controllers');
// middlewares
const { 
    validaJWT,
    validaCampos, 
    esAdminRol} = require('../middlewares');
// helpers
const { idExisteP, categoriaExiste} = require('../helpers/db-validator');

// {{url}}/api/productos
// CRUD
// obtener todos los productos con sus categorias - publico
router.get('/', productosGet);

// obtener la info de un producto con su categoria - publico
router.get('/:id', [ 
                   check('id', 'No es un Mongo ID').isMongoId()
                 , check('id').custom(idExisteP)
                 , validaCampos 
                ], productoGet);

// crear un producto con categoria existente - usuario con token - privado
router.post('/', [
                   validaJWT
                 , check('name', 'El nombre del producto es obligatorio').not().isEmpty() 
                 , check('state', 'El estado del producto es obligatorio').not().isEmpty()
                 , check('cat', 'La categoria del producto es obligatoria').not().isEmpty()
                 , check('cat').custom(categoriaExiste)
                 , validaCampos 
                ], productoPost);

// actualiza un producto y modifica su categoria (no crea) - usuario con token - privado
router.put('/:id', [                 
                      validaJWT
                    , check('id', 'No es un Mongo ID').isMongoId()
                    , check('id').custom(idExisteP)     
                    , check('name', 'El nombre del producto es obligatorio').not().isEmpty() 
                    , check('state', 'El estado del producto es obligatorio').not().isEmpty()
                    , check('cat', 'La categoria del producto es obligatoria').not().isEmpty()
                    , check('cat').custom(categoriaExiste)
                    , validaCampos 
], productoPut);

// borra logicamente un producto - usuario con rol ADMIN_ROL - privado
router.delete('/:id', [
                      validaJWT
                    , esAdminRol
                    , check('id', 'No es un Mongo ID').isMongoId()
                    , check('id').custom(idExisteP)
                    , validaCampos 
                  ] , productoDelete);

module.exports = router;