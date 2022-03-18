const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types

const postSchema = new mongoose.Schema({
    image:{
        type: String,
        required: true
    },
    postedBy:{
        type: ObjectId,
        ref: "User"
    },
    mushID:{
        type: ObjectId,
        ref:"Mushrooms"
    },
    voted: {
        type: Boolean,
        default: false,
    },
    date: {
        type: Date, //Might need to have extra specifications, required?
    },
    __v: {
        type: int, //not actually sure what __v is... lol
    }

})

mongoose.model("Post", postSchema)