const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        require : true,
        unigue : true,
    },
    fullName : {
        firstName : {
            type : String,
            require : true,
        },
        lastName : {
            type : String,
        }
    },
    password : {
        type : String,
        require : true,
    }
},{ timestamps: true});

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;