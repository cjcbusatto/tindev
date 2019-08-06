const express = require('express');
const routes = express.Router();
const DeveloperController = require('./controllers/DeveloperController');
const LikeController = require('./controllers/LikeController');
const DislikeController = require('./controllers/DislikeController');

routes.get('/devs', DeveloperController.index);
routes.post('/devs', DeveloperController.store);
routes.post('/devs/:id/likes', LikeController.store);
routes.post('/devs/:id/dislikes', DislikeController.store);
module.exports = routes;
