require('dotenv').config();

const Server = require('./models/server');

const server = new Server();

server.listen();
// ya no
//server.routes(); esta dentro del constructor ya
 

