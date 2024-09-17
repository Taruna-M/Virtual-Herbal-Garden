const express = require('express');
const path = require('path');
const app = express(); // Create a new Express app instance

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '../front/public')));

// Serve the Unity WebGL build files
app.use('/garden3', express.static(path.join(__dirname, '../front/public/garden3')));

// Catch-all route to serve React front-end
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../front/public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));