const Passenger = require("../models/Passenger");
const bcrypt = require("bcrypt");
//jwt
require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require("../models/User");
const nodemailer = require('nodemailer');
const api_key = process.env.API_KEY;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: process.env.USER,
        pass: process.env.PASS
    }
});



exports.createPassenger = async(req,res)=>{
    try{
       console.log("signup");
       const { firstName, lastName, telephone, email,password} = req.body;
       console.log(firstName, lastName, telephone, email,password);
       if(await User.findOne({telephone})){
           return res
           .status(409)
           .send('This telephone is existed');
       }
       if(await User.findOne({email})){
        return res
        .status(409)
        .send('This email is existed');
        }
       const hashPassword = await bcrypt.hash(password,12);

       const passenger = new Passenger({
           firstName,
           lastName,
           password: hashPassword,
           telephone,
           email
       });
       const result = await passenger.save();
       let mailOptions ={
           from: '1751010108phu@ou.edu.vn',
           to: email,
           subject: 'Welcome',
           text: 'Cảm ơn bạn đã đăng ký dịch vụ của chúng tôi',
       }
       transporter.sendMail(mailOptions, (error, info)=>{
            if(error){
                console.log(error);
            }
            else{
                console.log('email send:' + info.response);
            }
       });
       console.log("success");
       res.status(201).send("Đăng ký thành công");
    }catch(err){
        res.status(500).send(err);
    }
}