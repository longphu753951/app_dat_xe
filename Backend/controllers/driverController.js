const Driver = require("../models/Driver");
const User = require("../models/User");
const bcrypt = require("bcrypt");
//jwt
require('dotenv').config();
const jwt = require('jsonwebtoken');
const api_key = process.env.API_KEY;
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: process.env.USER,
        pass: process.env.PASS
    }
});

exports.createDriver = async(req,res)=>{
    try{
    console.log("signup");
       const { firstName, lastName, password, telephone, email} = req.body;

       if(await User.findOne({telephone})){
           return res
           .status(409)
           .json({error:'This telephone is existed'});
       }
       if(await User.findOne({email})){
        return res
        .status(409)
        .send('This email is existed');
        }
       const hashPassword = await bcrypt.hash(password,12);

       const driver = new Driver({
           firstName,
           lastName,
           password: hashPassword,
           telephone,
           email,
       });
       const result = await driver.save();
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
        console.log("signup");
       res.status(201).send("Đăng ký thành công");
    }catch(err){
        res.status(500).send(err);
    }
}