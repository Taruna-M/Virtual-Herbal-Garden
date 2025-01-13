//this is the main entry point for backend apis
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require("passport");
const path = require('path');
const app = express();

//imports
const connectDB = require('./config/connectDB');
const errorHandler = require('./middleware/errorHandler');
const { authenticateJWT } = require('./middleware/jwt');

//connect DB
connectDB();

// Middleware
//origin-> allow specific client urls to access backend server
//credentials -> allow cookies
app.use(cors({ origin: ["http://localhost:3000"], credentials: true })); 
app.use(cookieParser()); //parse the cookies
app.use(passport.initialize());
app.use(express.json());

// Route Imports
const geminiRoute = require('./routes/geminiRoute');
const noteRoute = require('./routes/notesRoute');
const loginRoute = require('./routes/loginRoute');
const accRoute = require('./routes/accRoute');
const dfRoute = require('./routes/dfRoute');
const pdbRoute = require('./routes/plantDbRoute');
//routes
app.use('/api', geminiRoute);
app.use('/api/notes', noteRoute);
app.use('/auth', loginRoute);
app.use('/acc', authenticateJWT, accRoute);
app.use('/api/df', dfRoute);
app.use('/api/plant', pdbRoute);

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
