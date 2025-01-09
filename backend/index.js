// backend/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const app = express();

// MongoDB Atlas Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch((err) => {
  console.error('❌ MongoDB Connection Failed:', err);
  process.exit(1);
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const noteRoutes = require('./routes/notes');
app.use('/api/notes', noteRoutes);

// Static file serving
app.use(express.static(path.join(__dirname, '../front/public')));
app.use('/garden5', express.static(path.join(__dirname, '../front/public/garden5')));

// Catch-all route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../front/public', 'index.html'));
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
