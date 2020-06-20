const compression = require('compression');
const express = require('express');
const routes = require('./routes');
const mongoose = require('mongoose');
const cors = require('cors');

// Read environment configuration
require('dotenv').config();
const { PROD_DB, TEST_DB, SERVER_PORT } = process.env;

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const connectedUsers = {};
io.on('connection', (socket) => {
    const { user } = socket.handshake.query;
    connectedUsers[user] = socket.id;
});

// Connect to the database
let databaseUrl = PROD_DB;
if (process.env.NODE_ENV === 'test') {
    databaseUrl = TEST_DB;
}

mongoose.connect(databaseUrl, {
    useNewUrlParser: true,
});

// Include middlewares
app.use(compression());
app.use((req, res, next) => {
    req.io = io;
    req.connectedUsers = connectedUsers;
    return next();
});

app.use(cors());
app.use(express.json());
app.use(routes);

// Initialize the server
server.listen(SERVER_PORT);

module.exports = server;