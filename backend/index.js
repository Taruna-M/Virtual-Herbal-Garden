require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express(); // Create a new Express app instance

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '../front/public')));

// Serve the Unity WebGL build files
app.use('/garden5', express.static(path.join(__dirname, '../front/public/garden5')));

// Catch-all route to serve React front-end
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../front/public', 'index.html'));
});
app.use(cors());
app.use(express.json());

const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
