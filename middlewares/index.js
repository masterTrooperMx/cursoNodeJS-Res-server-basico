
// vamos a darle el nombre a la constante del archivo middleware
const validaCampos = require('./valida-campos');
const validaJWT = require('./valida-jwt');
const validaRoles = require('./valida-roles');
const validaUploads = require('./valida-uploads');

module.exports = {
    ...validaCampos,
    ...validaJWT,
    ...validaRoles,
    ...validaUploads
}