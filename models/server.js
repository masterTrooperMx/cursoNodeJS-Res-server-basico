const express = require('express');
var cors = require('cors');
const { json } = require('express/lib/response');

const { dbConnection } = require('../db/config');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usersPath = '/api/users';

        // db connection
        this.connectDB();
        // middlewares
        this.middlewares();
        // routes
        this.routes();
        // everything else fails
        this.forbidden();
    }

    async connectDB() {
        await dbConnection();
    }
    
    middlewares() {
        // CORS
        this.app.use(cors());
        // parsing y reading body
        this.app.use(express.json());
        // publica la carpeta publica
        this.app.use(express.static('public'));
    }

    routes() {
        // la nueva ruta de usuarios
        this.app.use(this.usersPath, require('../routes/user.routes'));
    }

    forbidden() {
        this.app.use((request, response ) => {
            response.statusCode = 404;
            response.send('404!');
        });
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Escuchando puerto ${this.port}`);
        });
    }
};

module.exports = Server;

/*
GET curl -v http://127.0.0.1:8080/api
POST curl -v --data "para1=val1&para2=val2" http://127.0.0.1:8080/api
POST curl -X POST -d @filename http://127.0.0.1/api
*/