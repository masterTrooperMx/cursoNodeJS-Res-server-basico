
// vamos a darle el nombre a la constante del archivo middleware
const validaCampos = require('../middlewares/valida-campos');
const validaJWT = require('../middlewares/valida-jwt');
const validaRoles = require('../middlewares/valida-roles');

module.exports = {
    ...validaCampos,
    ...validaJWT,
    ...validaRoles
}