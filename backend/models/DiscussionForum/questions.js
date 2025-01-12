const mongoose = require('mongoose');
const questionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    authorId: { type: String, ref: 'User', required: true },
    authorName:{ type: String, ref: 'User', required: true }, // Reference to user
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
    tags:{type: String}
  }, { timestamps: true });
  
  module.exports = mongoose.model('Question', questionSchema);
  