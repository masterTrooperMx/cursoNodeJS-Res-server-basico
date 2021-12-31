// helpers
const { generarJWT }  = require('./jwt-validador');
const { googleVerify} = require('./google-validador');
const { dbHelps}      = require('./db-validator');
const { uploadHelps}  = require('./uploads-validator');

// exportamos expandiendo su contenido
module.exports = {
    ...generarJWT,
    ...googleVerify,
    ...dbHelps,
    ...uploadHelps
};