const {request, response} = require('express');

const valida_uploads = (req = request, res = response, next) => {
    console.log(__dirname, req.files);
    // from: https://github.com/richardgirges/express-fileupload/tree/master/example
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        return res.status(400).json({
            msg: 'No hay archivos que subir.'
        });;
    };
    next();
};

module.exports = {
    valida_uploads
}