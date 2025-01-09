//this is the main entry point for backend apis
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

//imports
const connectDB = require('./config/connectDB');
const errorHandler = require('./middleware/errorHandler');

//connect DB
connectDB();

// Middleware
app.use( cors({ origin: "http://localhost:3000" })); //frontend origin 
app.use(express.json());

// Route Imports
const geminiRoute = require('./routes/geminiRoute');
const noteRoute = require('./routes/notesRoute');

//routes
app.use('/api', geminiRoute);
app.use('/api/notes', noteRoute);

// Static file serving
app.use(express.static(path.join(__dirname, '../front/public')));
app.use('/garden5', express.static(path.join(__dirname, '../front/public/garden5')));

// Catch-all route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../front/public', 'index.html'));
});

//error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
