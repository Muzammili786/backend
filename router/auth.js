const express = require('express');
const router = express.Router();
const bcrypt=require("bcryptjs")
const nodemailer=require("nodemailer")
const crypto=require("crypto")
var jwt = require('jsonwebtoken');
require('../db/conn');
const User = require('../model/userSchema');

// email verification using nodemailer
var transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
      user:"harisharry232@gmail.com",
      pass:"edecmeujlpalnvpq"
    },
    tls:{
      rejectUnauthorized:false
    }
  })
// create user
router.post('/register', async(req, res,next) => {
  const {name,email,password}=req.body  
  if(!name || !email || !password){
    res.json("Please add all fields")
  } 
const userExists=await User.findOne({email})
if(userExists){
    res.json("User Already Exists")
}
// Hash password
const salt=await bcrypt.genSalt(10)
const hashPassword= await bcrypt.hash(password,salt)
const user=await User.create({
  name,
  email,
  password:hashPassword,
  emailToken:crypto.randomBytes(64).toString('hex'),
  isVerified:false
})
// Sending EMail
var mailOption={
  from:'"Verify your email" <harisharry232@gmail.com>',
  to:user.email,
  subject:'E-HELP Verify your email',
  html:`<h2>${user.name}! Thank you for registering on E-HELP</h2>
  <h4>Please Verify your email to continue...</h4>
  <a href="http://${req.headers.host}/verify-email?token=${user.emailToken}">Verify Your Email</a>`
}
transporter.sendMail(mailOption,function(error){
  if(error){
    console.log(error)
  }
  else{
    console.log('A Verification Link has been sent to your Respected email');
  }
})
if(user){
  res.status(201).json({
    _id:user.id,
    name:user.name,
    email:user.email,
    token:generateToken(user._id)
  })
}
else{
  res.json("Invalid Data")
}    
  });
const generateToken = (id) => {
  return jwt.sign({id},process.env.JWT,{
    expiresIn:'3d',
  })
}
router.get("/verify-email",async(req,res,next)=>{
    const token=req.query.token
    const user=await User.findOne({emailToken:token})
    if(user){
      user.emailToken=null;
      user.isVerified=true;
      await user.save();
      res.json("User is Verified")
    }
    else{
      res.json("User is not Verified Please verify First")
    } 
  })
// Login
router.post("/login",async(req,res)=>{
  const {email,password} = req.body
  const user = await User.findOne({email})
  if(user && (await bcrypt.compare(password, user.password)) && user.isVerified){
    res.json("Welcome To User Profile")
  }
  else{
      res.json("You are not verified")
    }   
})
module.exports = router;