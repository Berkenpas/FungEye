const express = require('express');
const app = express();
const PORT = 5000;
const mongoose = require('mongoose');
const {MONGOURI} = require('./keys');
const cors = require('cors');


mongoose.connect(MONGOURI, {
    useNewUrlParser:true,
    useUnifiedTopology: true
})
mongoose.connection.on('connected', ()=>{
    console.log('connected to mongo');
})
mongoose.connection.on('error', (err)=>{
    console.log('connection error', err);
})

require ('./models/user');
require('./models/mush_species');
require('./models/post');
mongoose.model("User");

app.use(express.json());
app.use(require('./routes/auth'));
app.use(require('./routes/post'));

app.listen(PORT, ()=>{
    console.log('server is running on ', PORT);
})
