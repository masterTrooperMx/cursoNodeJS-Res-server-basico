const {Schema, model} = require('mongoose');

const RolSchema = Schema({
    rol: {
        type: String,
        required: [true, 'El rol es obligatorio']
    }
});

// https://mongoosejs.com/docs/models.html
// el nombre de la collection (tabla) es Rol pero le va a poner rols por defecto
module.exports = model('Rol', RolSchema);