const mongoose = require('mongoose');

const mushSchema = new mongoose.Schema({
    common:{
        type: String,
        required: true,
        default: "None"
    },
    latin:{
        type: String,
        required: true,
        default: "None"
    },
    wiki:{
        type: String,
        default: "http://google.com"
    }

})

mongoose.model("Mushrooms", mushSchema)