const path         = require('path');
const {v4: uuidv4} = require('uuid');

const subirArchivo = (files, extensionesValidas = ['png','jpg','jpge','gif'], newUplds = '') => {
    return new Promise ( (resolve, reject) => {
        // The name of the input field (i.e. "archivo") is used to retrieve the uploaded file
        const sampleFile = files.archivo;
        //vamos a crear nombres unicos para nuestros archivos
        const nombrePartes = sampleFile.name.split('.');
        const extension = nombrePartes[nombrePartes.length - 1];
        if(!extensionesValidas.includes(extension)){
            return reject(`la extension del archivo '${sampleFile.name}' no es valida`);
        }
        const nombreTmp = uuidv4() + '.' + extension;
        // manejo del nombre del archivo sampleFile.name =
        uploadPath = path.join(__dirname, '../public/uploads/', newUplds, nombreTmp);
        // Use the mv() method to place the file somewhere on your server
        sampleFile.mv(uploadPath, (err) => {
            if (err){
                console.log(err);
                return reject(err);
            };
            resolve(nombreTmp);
        });
    });
};

module.exports = {
    subirArchivo
}