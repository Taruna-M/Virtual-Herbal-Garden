const express = require('express');
const dfController = require('../controllers/dfController');

const router = express.Router();

// Routes for discussion forum
router.get('/questions', dfController.getAllQuestions);
router.get('/questions/:id', dfController.getQuestionDetails);
router.post('/questions', dfController.createQuestion);
router.post('/answers', dfController.createAnswer);
router.post('/comments', dfController.createComment);

module.exports = router;
