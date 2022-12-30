const express = require('express');
const router = express.Router();

require('../db/conn');
const User = require('../model/userSchema');


router.get('/', (req, res) => {
    res.send('hello world server router page');
});

//with promises

router.post('/register', (req, res) => {
    // data get 
    const { name, email, password } = req.body;
    
    // console.log(name);
    // console.log(email);
    // res.send("mera register page");
    // res.json({message: req.body});
// check user not empty field
    if(!name || !email || !password){
        return res.status(422).json({error: "plz filled the field properly"});
    }
//condition check email are existed or not if not make a new doc
// user for  get user schema  
User.findOne({email:email })
    .then((userExist) => {
        if(userExist){
           return res.status(422).json({ error: "Email already Exist" }); 
        }

        const user = new User({name, email, password})

    // save method returns promises
    // 500 error for database
        user.save().then(() => {
            res.status(201).json({message:"user register successfuly"});
        }).catch((err) => res.status(500).json({error:"Failed to registerd"}));

    }).catch(err => { console.log(err); });

});

// with async


// router.post('/register', async (req, res) => {
   
//     const { name, email, password } = req.body;

//     if(!name || !email || !password){
//         return res.status(422).json({error: "plz fill the field properly"});
//     }

//     try {

//         const userExist = await User.findOne({email: email});

//         if (userExist){
//             return res.status(422).json({error: "Email already Exist"});
//         }

//         const user = new User({name, email, password});
        
//         await user.save();

//         res.status(201).json({ message: "user registerd successfuly"});

//     }catch (err) {
//         console.log(err);
//     }


// });

//login

router.post('/signin', async (req, res) => {
    try{
        const { email, password } = req.body;
    
        if(!email || !password){
            return res.status(400).json({error: "fill the data"})
        }

        const userLogin = await User.findOne({email:email});
        console.log(userLogin);
        res.json({message: "user signing successfully"});
    }
    catch (err) {
        console.log(err);
    }
})

module.exports = router;