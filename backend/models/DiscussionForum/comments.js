const mongoose = require('mongoose');
const commentSchema = new mongoose.Schema({
    parentId: { type: mongoose.Schema.Types.ObjectId, required: true }, // ID of the question or answer
    parentType: { type: String, enum: ['Question', 'Answer'], required: true }, // Distinguish if the comment is for a question or answer
    authorId: { type: String, ref: 'User', required: true },
    authorName: { type: String, ref: 'User', required: true },// Reference to user
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
  }, { timestamps: true });
  
  module.exports = mongoose.model('Comment', commentSchema);
  