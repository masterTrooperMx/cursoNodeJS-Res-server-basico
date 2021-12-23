const jwt = require('jsonwebtoken');

const generarJWT = (uid = '') => {
    const privateKey = process.env.SECRETORPRIVATEKEY;
    return new Promise((resolve, reject) => {
        const payload = { uid };
        jwt.sign(payload, privateKey, {expiresIn: '4h'} , ( error, token) => {
            if(error) {
                console.log(error);
                reject('No se pudo generar el JWT');
            } else {
                resolve(token);
            }
        });
    });
};

module.exports = { generarJWT };