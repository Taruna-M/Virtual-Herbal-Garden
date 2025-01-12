const Question = require('../models/DiscussionForum/questions');
const Answer = require('../models/DiscussionForum/answers');
const Comment = require('../models/DiscussionForum/comments');
const mongoose=require('mongoose')
// Fetch all questions
exports.getAllQuestions = async () => {
  return await Question.find().sort({ createdAt: -1 });
};

// Get question details along with answers and comments
exports.getQuestionDetails = async (questionId) => {
  const question = await Question.findById(questionId);
  const answers = await Answer.find({ questionId }).sort({ createdAt: -1 });
  const comments = await Comment.find({ parentId: questionId, parentType: 'Question' }).sort({ createdAt: -1 });

  const answerComments = {};
  for (const answer of answers) {
    answerComments[answer._id] = await Comment.find({
      parentId: answer._id,
      parentType: 'Answer',
    }).sort({ createdAt: -1 });
  }

  return { question, answers, comments, answerComments };
};

// Create a new question
exports.createQuestion = async (data) => {
  const { title, description, tags, authorId, authorName } = data;
  const newQuestion = new Question({ title, description, tags, authorId, authorName });
  
  return await newQuestion.save();
};

// Create a new answer
exports.createAnswer = async (data) => {
  const { questionId, content, authorId, authorName } = data;
if (!mongoose.Types.ObjectId.isValid(questionId)) {
  return res.status(400).json({ error: "Invalid questionId" });
}
const objectId = new mongoose.Types.ObjectId(questionId);



  const newAnswer = new Answer({ questionId:objectId, content, authorId, authorName });
  return await newAnswer.save();
};

// Create a new comment
exports.createComment = async (data) => {
  const { parentId, parentType, content, authorId, authorName } = data;
  
if (!mongoose.Types.ObjectId.isValid(parentId)) {
  return res.status(400).json({ error: "Invalid parentId" });
}
const objectId = new mongoose.Types.ObjectId(parentId);
  const newComment = new Comment({ parentId:objectId, parentType, content, authorId, authorName });
  return await newComment.save();
};
