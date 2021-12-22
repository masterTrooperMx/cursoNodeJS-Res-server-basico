const { request, response } = require('express');
const { validationResult} = require('express-validator');

const validaCampos = (req = request, res = response, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json(errors);
    }
    // ofrece la posibilidad de seguir con el siguiente middleware
    next();
};

module.exports = {
    validaCampos
};