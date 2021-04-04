const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
    },
    lastName:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    telephone:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    wallet:{
        type: mongoose.Decimal128,
        required: true,
        default: 200000.0,
    },
    createDate:{
        type: Date,
        default: Date.now,
    },
},{discriminatorKey: 'kind',collection: 'users'});

const User = mongoose.model('User', UserSchema)
module.exports = User;