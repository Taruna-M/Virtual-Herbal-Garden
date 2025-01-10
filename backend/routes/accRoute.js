const express = require('express');
const router = express.Router();
const passport = require('../config/passportConfig');
const { getAccController } = require('../controllers/accController');

//fetch acc details
router.get('/:uid', getAccController);

module.exports = router; 