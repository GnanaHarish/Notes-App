const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notesController');


//Homepage
router.get('/', notesController.homepage);
router.get('/about', notesController.about);


module.exports = router;