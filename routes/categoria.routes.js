const { Router } = require('express');
const {request, response} = require('express');
const {check} = require('express-validator');

const router = Router();
// controllers
const { 
    categoriasGet,
    categoriaGet,
    categoriasPost,
    categoriasPut,
    categoriasDelete} = require('../controllers/categorias.controllers');
// middlewares
const { 
    validaJWT,
    validaCampos, 
    esAdminRol} = require('../middlewares');
// helpers
const { idExisteC } = require('../helpers/db-validator');
// {{url}}/api/categorias
// CRUD
// obtener todas las categortias - publicos
router.get('/', categoriasGet);

// obtener una categoria por id - publico
router.get('/:id', [ 
                    check('id', 'No es un Mongo ID').isMongoId()
                  , check('id').custom(idExisteC)
                  , validaCampos
                 ], categoriaGet);

//crear categoria - privado cualquiera con un token privado
router.post('/', [ 
                 validaJWT
              , check('name', 'El nombre de la categoria es obligatorio').not().isEmpty() 
              , check('state', 'El estado de la categoria es obligatorio').not().isEmpty()
              , validaCampos 
            ] , categoriasPost);

// acualizar id - privado
router.put('/:id', [
                    validaJWT
                  , check('id', 'No es un Mongo ID').isMongoId()
                  , check('id').custom(idExisteC)
                  , check('name').not().isEmpty()
                  , validaCampos 
                ] , categoriasPut);

// borrar categoria id - ADMIN_ROL
router.delete('/:id',[
                      validaJWT
                    , check('id', 'No es un Mongo ID').isMongoId()
                    , check('id').custom(idExisteC)
                    , esAdminRol
                    , validaCampos   
                   ], categoriasDelete);

module.exports = router;