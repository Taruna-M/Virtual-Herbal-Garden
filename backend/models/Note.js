// backend/models/Note.js
const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  back: {
    type: String,
    default: 'Back',
  },
  title2: {
    type: String,
    default: 'Title',
  },
  environment: {
    type: String,
    default: 'Content',
  },
}, { 
  timestamps: true 
});

const Note = mongoose.model('notes', NoteSchema);
module.exports = Note;