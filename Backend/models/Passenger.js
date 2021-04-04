const mongoose = require("mongoose");
const user = require("../models/User");

const PassengerSchema = new mongoose.Schema({
    diemTichLuy:{
        type: Number,
        default: 0,
    },
    thanhTich:{
        type:String,
        enum:['Chưa có','Đồng','Vàng','Bạc','Kim cương'],
        default: 'Chưa có'
    }
});

const Passenger = user.discriminator('Passenger', PassengerSchema)

module.exports = Passenger;
    
