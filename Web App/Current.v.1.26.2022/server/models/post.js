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
    }

})

mongoose.model("Post", postSchema)