// backend/routes/notes.js
const express = require('express');
const router = express.Router();
const { getAllNotesController, getNoteController, createNoteController, updateNoteController, deleteNoteController} = require('../controllers/notesController');

// Get all notes
router.get('/', getAllNotesController);

// Get single note
router.get('/:id', getNoteController);

// Create note
router.post('/', createNoteController);

// Update note
router.patch('/:id', updateNoteController);

// Delete note
router.delete('/:id', deleteNoteController);

module.exports = router;