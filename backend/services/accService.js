const AppError = require('../utils/AppError');
const AppRes = require('../utils/AppRes');
const User = require('../models/User');
const { createJWT } = require('../middleware/jwt');
//google login
exports.loginService = async(uid, userName, email, profilePic = null) => {
    //check if stored in db
    const user = await User.findOne({ uid }).select('-_id -__v');
    const jwt = createJWT({userName, email, uid});
    if (user) return new AppRes(`logged in`, 200, { uid: user.uid, jwt });

    //if not store it
    const newLogin = await User.create({ uid, userName, email, profilePic });
    return new AppRes(`logged in`, 201, { uid: newLogin.uid, jwt });
}

//fetch acc details
exports.getAccService = async (uid) => {
    const user = await User.findOne({ uid }).select('-_id -__v');
    if (!user) return new AppError('User not found', 404);
    return new AppRes(`User found`, 200, user);
};