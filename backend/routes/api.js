const express = require('express');
const axios = require('axios');
const router = express.Router();

const geminiApiKey = process.env.GEMINI_API_KEY;

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

module.exports = router;
