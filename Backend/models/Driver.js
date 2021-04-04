const mongoose = require("mongoose");
const user = require("../models/User");

const DriverSchema = new mongoose.Schema({
    danhGia:{
        type: Number,
        default:0.0,
    },
    imageURL:{
        type: String,
        required: false,
    },
});

const Driver = user.discriminator('Driver',DriverSchema);
module.exports = Driver;