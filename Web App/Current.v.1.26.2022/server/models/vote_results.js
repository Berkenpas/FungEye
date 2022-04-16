const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types

const resultSchema = new mongoose.Schema({
    picID:{
        type: ObjectId,
        ref: "Post"
    },
    maxVote:{
        type: Number
    },
    voteResult:{
        type: ObjectId,
        ref: "Mushrooms"
    },
    prediction:{
        type: ObjectId,
        ref: "Mushrooms"
    }
})

mongoose.model("VoteResults", resultSchema)