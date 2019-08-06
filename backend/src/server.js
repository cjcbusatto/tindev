const express = require('express');
const server = express();
const routes = require('./routes');
const mongoose = require('mongoose');
const cors = require('cors');

// Read environment configuration
require('dotenv').config();
const { DB_CONNECTION_URL, SERVER_PORT } = process.env;

// Connect to the database
mongoose.connect(DB_CONNECTION_URL, {
    useNewUrlParser: true,
});

// Include middlewares
server.use(cors());
server.use(express.json());
server.use(routes);

// Initialize the server
server.listen(SERVER_PORT);
