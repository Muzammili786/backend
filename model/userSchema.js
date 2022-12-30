const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true,
    },
    email:{
        type: String,
        require: true
    },
    password:{
        type: String,
        require: true
    },

})



// password hashing

userSchema.pre('save', async function(next) {
    if(this.isModified('password')){
        this.password = bcrypt.hash(this.password, 12);
    }  
    next();
});

const User = mongoose.model('REGISTRATION', userSchema);

module.exports=mongoose.model('Users',userSchema)