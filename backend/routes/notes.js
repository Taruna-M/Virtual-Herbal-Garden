const express = require('express');
const router = express.Router();
const connectDB=require('../models/Note')

// Get all notes
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single note by ID
router.get('/:id', getNote, (req, res) => {
  res.json(res.note);
});

// Create a new note
router.post('/', async (req, res) => {
  const note = new Note({
    title: req.body.title,
    content: req.body.content,
    date: req.body.date,
    back: req.body.back,
    title2: req.body.title2,
    environment: req.body.environment,
  });

  try {
    const newNote = await note.save();
    res.status(201).json(newNote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a note
router.patch('/:id', getNote, async (req, res) => {
  if (req.body.title != null) {
    res.note.title = req.body.title;
  }
  if (req.body.content != null) {
    res.note.content = req.body.content;
  }
  if (req.body.date != null) {
    res.note.date = req.body.date;
  }
  if (req.body.back != null) {
    res.note.back = req.body.back;
  }
  if (req.body.title2 != null) {
    res.note.title2 = req.body.title2;
  }
  if (req.body.environment != null) {
    res.note.environment = req.body.environment;
  }

  try {
    const updatedNote = await res.note.save();
    res.json(updatedNote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a note
router.delete('/:id', getNote, async (req, res) => {
  try {
    await res.note.remove();
    res.json({ message: 'Deleted Note' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to get a note by ID
async function getNote(req, res, next) {
  let note;
  try {
    note = await Note.findById(req.params.id);
    if (note == null) {
      return res.status(404).json({ message: 'Cannot find note' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.note = note;
  next();
}

module.exports = router;
