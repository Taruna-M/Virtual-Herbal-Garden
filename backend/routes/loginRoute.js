const express = require('express');
const router = express.Router();
const passport = require('../config/passportConfig');
const { loginController } = require('../controllers/accController')

//google login entry point
router.get("/google",
    passport.authenticate("google", { 
        scope: ["profile", "email"],
        session: false, //session false for stateless auth
        prompt: 'select_account' //For popping the google sign in window for every login to allow users to choose an account.
    })
);

//google callback / redirect endpoint
router.get("/google/callback", passport.authenticate("google", {session: false}), loginController);

module.exports = router; 