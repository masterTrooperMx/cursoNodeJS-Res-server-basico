const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        const dbUser = process.env.USER_DB;
        const dbPass = process.env.PASS_USER_DB;
        const dbCNN = `mongodb+srv://${dbUser}:${dbPass}@micluster-mongo.fsbyd.mongodb.net/cafe`;
        await mongoose.connect(dbCNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('conectado a bd');
    } catch (error) {
        console.log(error);
        throw new Error('inicializacion de la bd incorrecto');
    }
};


module.exports = {
    dbConnection
};