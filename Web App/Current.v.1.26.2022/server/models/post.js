const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types

const postSchema = new mongoose.Schema({
    image:{
        type: String,
        required: true
    },
    postedBy:{
        type: ObjectId,
        ref: "User",
        required: true
    },
    mushID:{
        type: ObjectId,
        ref:"Mushrooms"
    },
    voted:{
        type: Boolean,
        default: false
    },
    date:{
        type: Date
    }

})

mongoose.model("Post", postSchema)