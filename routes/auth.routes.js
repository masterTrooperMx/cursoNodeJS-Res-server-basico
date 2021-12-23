const { Router } = require('express');
const {check} = require('express-validator');

const router = Router();
const { 
    authGet, 
    authLogin } = require('../controllers/auth.controllers');
const { validaCampos } = require('../middlewares/valida-campos');

// API get, hay un ajuste de rutas, por lo que hay que cambiar la ruta de cada servicio a / y en el router queda todo
router.get('/', authGet);
// API post
router.post('/login', [
                    check('pass','El pass es obligatorio').not().isEmpty()
                    ,check('email','El correo no es valido').isEmail()
                    ,validaCampos
                      ], authLogin);

module.exports = router;