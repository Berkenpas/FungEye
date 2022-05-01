const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types

const voteSchema = new mongoose.Schema({
    user:{
        type: ObjectId,
        ref: "Users"
    },
    image_id:{
        type: ObjectId,
        ref: "Post"
    },
    vote:{
        type: ObjectId,
        ref: "Mushrooms"
    }
})

mongoose.model("Votes", voteSchema)