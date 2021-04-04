const bcrypt = require("bcrypt");
//jwt
require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require("../models/User");
const api_key = process.env.API_KEY;

exports.loginUser = async (req,res, next)=>{
    console.log("login");
    
    const {telephone, password} = req.body;
    const user = await User.findOne({telephone});
    console.log(user);
    if(user){
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(isPasswordCorrect){
            
            const token = jwt.sign({firstName:user.firstName,lastName:user.lastName,telephone:user.telephone, email:user.email,kind:user.kind}, api_key);
            console.log("success");
            return res.json({token : token});
        }
        return res.status(409).json({error:'Wrong password'});
    }
    return res.status(409).json({error:'Telephone does not exist'});
};