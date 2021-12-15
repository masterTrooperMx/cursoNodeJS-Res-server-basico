const { Router } = require('express');
const { usersGet, usersPost, usersPut, usersPatch, usersDelete } = require('../controllers/users.controllers');

const router = Router();

// API get, hay un ajuste de rutas, por lo que hay que cambiar la ruta de cada servicio a / y en el router queda todo
router.get('/', usersGet);
// API put
router.put('/:id', usersPut);
// API post
router.post('/', usersPost);
// API patch
router.patch('/', usersPatch);
// API delete
router.delete('/', usersDelete);

module.exports = router;