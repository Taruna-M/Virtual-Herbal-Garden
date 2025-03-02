const express = require('express');
const router = express.Router();
const { getPlantController } = require('../controllers/mainBookController');

//fetch Single Plant
router.get('/:id', getPlantController);

module.exports = router;