// backend/routes/app.js
const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const Note = require('../models/Note');
const router = express.Router();

const geminiApiKey = process.env.GEMINI_API_KEY;

// Existing Gemini API route
router.post('/generate-content', async (req, res) => {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${geminiApiKey}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: req.body.text }],
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching from Gemini API:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

// Get all notes
router.get('/notes', async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single note
router.get('/notes/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create note
router.post('/notes', async (req, res) => {
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

// Update note
router.patch('/notes/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    Object.keys(req.body).forEach(key => {
      if (req.body[key] != null) {
        note[key] = req.body[key];
      }
    });

    const updatedNote = await note.save();
    res.json(updatedNote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete note
router.delete('/notes/:id', async (req, res) => {
  try {
    const result = await Note.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
