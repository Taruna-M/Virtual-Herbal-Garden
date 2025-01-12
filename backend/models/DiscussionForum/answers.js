const mongoose = require('mongoose');
const answerSchema = new mongoose.Schema({
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true }, // Link to the related question
    authorId: { type: String, ref: 'User', required: true }, // Reference to user
    authorName:{ type: String, ref: 'User', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
  }, { timestamps: true });
  
  module.exports = mongoose.model('Answer', answerSchema);
  