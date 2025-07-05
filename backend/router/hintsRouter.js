const express = require('express');
const hintsRouter = express.Router();
const hintController = require('../controllers/hintController');

hintsRouter.post('/', hintController.generateHints);

module.exports = hintsRouter;