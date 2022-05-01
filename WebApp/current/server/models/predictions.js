const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types

const predictSchema = new mongoose.Schema({
    picture:{
        type: ObjectId,
        ref: "Post"
    },
    mush_type:{
        type: ObjectId,
        ref: "Mushrooms"
    },
    confidence:{
        type: mongoose.Decimal128
    }
})

mongoose.model("Predictions", predictSchema)