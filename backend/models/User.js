const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    uid: {
        type: String,
        required: true,
        unique: true
    },
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    profilePic: {
        type: String,
        default: null
    }
});

const User = mongoose.model('users', userSchema);
module.exports = User;