const {Schema, model} = require('mongoose');

const ProductoSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
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
    },
    price: {
        type: Number,
        default: 0
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    desc: {
        type: String,
    },
    disp: {
        type: Boolean,
        default: true
    },
    img: {
        type: String
    }
});

// vamos a sobrecargar un metodo de mongoose en este caso
// hacemos esto para sacar de la respuesta la version y el password
ProductoSchema.methods.toJSON = function () { // serializar para el momento que utilizamos JSON de lo que viene de Mongo
    const {__v, _id, ..._producto} = this.toObject();
    _producto.uid = _id; // cambiando el _id a uid
    return _producto;
};

// https://mongoosejs.com/docs/models.html
// el nombre de la collection (tabla) es Producto pero le va a poner productos por defecto
module.exports = model('Producto', ProductoSchema);