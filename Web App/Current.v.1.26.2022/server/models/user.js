const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    score:{
        type: Number,
        required: true
    },
    algo_wallet:{
        type: String,
        required: true
    }
})

mongoose.model ("User",userSchema)