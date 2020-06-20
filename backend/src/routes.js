const express = require('express');
const routes = express.Router();
const DeveloperController = require('./controllers/DeveloperController');
const LikeController = require('./controllers/LikeController');
const DislikeController = require('./controllers/DislikeController');

routes.get('/developers', DeveloperController.index);
routes.post('/developers', DeveloperController.store);
routes.post('/developers/:id/likes', LikeController.store);
routes.post('/developers/:id/dislikes', DislikeController.store);
module.exports = routes;
