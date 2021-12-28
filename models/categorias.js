const {Schema, model} = require('mongoose');

const CategoriaSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    state: {
        type: Boolean,
        default: true,
        required: [true, 'El estado es obligatorio']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

// vamos a sobrecargar un metodo de mongoose en este caso
// hacemos esto para sacar de la respuesta la version y el password
CategoriaSchema.methods.toJSON = function () { // serializar para el momento que utilizamos JSON de lo que viene de Mongo
    const {__v, state, ..._categoria} = this.toObject();
    //_categoria.uid = _id; // cambiando el _id a uid
    return _categoria;
};

// https://mongoosejs.com/docs/models.html
// el nombre de la collection (tabla) es Rol pero le va a poner rols por defecto
module.exports = model('Categoria', CategoriaSchema);