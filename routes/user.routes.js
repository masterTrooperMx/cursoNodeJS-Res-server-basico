const { Router } = require('express');
const {check} = require('express-validator');

const { 
    usersGet, 
    usersPost, 
    usersPut, 
    usersPatch, 
    usersDelete } = require('../controllers/users.controllers');

const { validaCampos } = require('../middlewares/valida-campos');
const { 
    isValidRol,
    emailExiste,
    idExiste } = require('../helpers/db-validator');

const router = Router();

// API get, hay un ajuste de rutas, por lo que hay que cambiar la ruta de cada servicio a / y en el router queda todo
router.get('/', usersGet);
// API put :id es obligatorio por express
router.put('/:id', [check('id', 'No es un Mongo ID').isMongoId()
                , check('id').custom(idExiste)
                ,check('rol').custom(isValidRol)
                , validaCampos]
                , usersPut);
// API post
// aserciones para validar campos vienen con la funcion validationResult que es de express-validator
router.post('/', [check('name','El nombre es obligatorio').not().isEmpty()
                ,check('email','El correo no es valido').isEmail()
                ,check('email').custom(emailExiste)
                ,check('pass','El pass es obligatorio de mas de 6 letras').isLength({min: 6})
                //,check('rol','No es un rol permitido').isIn(['ADMIN_ROL', 'USER_ROL'])
                ,check('rol').custom(isValidRol)
                , validaCampos]
                , usersPost);
// API patch
router.patch('/', usersPatch);
// API delete
router.delete('/:id', [check('id', 'No es un Mongo ID').isMongoId()
                    , check('id').custom(idExiste)
                    , validaCampos] 
                    , usersDelete);

module.exports = router;