const AppRes = require('../utils/AppRes');
const dfService = require('../services/dfService');
//need to change to appres
// Fetch all questions
exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await dfService.getAllQuestions();
  
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ error: error+'a' });
  }
};

// Get details of a question
exports.getQuestionDetails = async (req, res) => {
  try {
    const questionDetails = await dfService.getQuestionDetails(req.params.id);
    res.status(200).json(questionDetails);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching question details' });
  }
};

// Create a new question
exports.createQuestion = async (req, res) => {
  
  try {
    const newQuestion = await dfService.createQuestion(req.body);
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// Create a new answer
exports.createAnswer = async (req, res) => {
  try {
    const newAnswer = await dfService.createAnswer(req.body);
    res.status(201).json(newAnswer);
  } catch (error) {
    res.status(500).json({ error: error+'aa'});
  }
};

// Create a new comment
exports.createComment = async (req, res) => {
  try {
    const newComment = await dfService.createComment(req.body);
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: error+'aaa' });
  }
};
