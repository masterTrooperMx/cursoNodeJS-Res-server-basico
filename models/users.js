const {Schema, model} = require('mongoose');

const UserSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    pass: {
        type: String,
        required: 'La contraseña es obligatoria'
    },
    img: {
        type: String
    },
    rol: {
        type: String,
        required: true,
        enum: ['ADMIN_ROL', 'USER_ROL'],
        default: 'USER_ROL'
    },
    state: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

// vamos a sobrecargar un metodo de mongoose en este caso
// hacemos esto para sacar de la respuesta la version y el password
UserSchema.methods.toJSON = function () { // serializar para el momento que utilizamos JSON de lo que viene de Mongo
    const {__v, _id, pass, ..._usuario} = this.toObject();
    _usuario.uid = _id; // cambiando el _id a uid
    return _usuario;
};

// https://mongoosejs.com/docs/models.html
// el nombre de la collection (tabla) es User pero le va a poner users por defecto
module.exports = model('User', UserSchema);