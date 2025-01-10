const AppRes = require('../utils/AppRes');
const { loginService, getAccService } = require('../services/accService');

const loginController = async (req, res, next) => {
    try {
        const { id, displayName, emails, photos } = req.user;
        const email = emails[0]?.value;
        const profilePic = photos[0]?.value;
        const result = await loginService(id, displayName, email, profilePic);
        const { uid, jwt } = result.payload;
        res.cookie('loginToken', jwt, {
            httpOnly: true, 
            secure: false,
            maxAge: 3600000  
        });
        res.redirect(`http://localhost:3000/login?uid=${uid}`); //TODO: make client side URL as env var just for temp kept here
    }
    catch(err) {
        next(err);
    }
};

const getAccController = async (req, res, next) => {
    try {
        const result = await getAccService(req.params.uid);
        AppRes.send(res, result.message, result.statusCode, result.payload);
    } catch (err) {
        next(err);
    }
};


module.exports = { loginController, getAccController };