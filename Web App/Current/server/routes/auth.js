const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../keys');
const requireLogin = require('../middleware/requireLogin');

const User = mongoose.model("User");


router.post('/signup', (req, res)=>{
    const {name, email, password} = req.body;
    if(!email || !password || !name){
        return res.status(400).json({error: "Please add all fields."});
    }
    
    User.findOne({email:email})
        .then((savedUser)=>{
            if(savedUser){
                return res.status(400).json({error: "User already exists."});       
            }

            bcrypt.hash(password, 12)
                .then(hashedpassword=>{
                    const user = new User({
                        email,
                        name,
                        password: hashedpassword
                    })

                    user.save()
                        .then(user=>{
                            res.json({message: 'saved successfully'})
                        })
                        .catch (err =>{
                            console.log(err)
                        })
                })   
        })
        .catch(err =>{
            console.log(err)
        })
})

router.post('/login', (req, res)=>{
    const {email, password} = req.body
    if(!email || !password){
        return res.status(400).json({error: "Please add email or password."})
    }
    User.findOne({email: email})
        .then(savedUser =>{
            if(!savedUser){
                return res.status(400).json({error: "Invalid credentials."})
            }
            //compare password
            bcrypt.compare(password, savedUser.password)
                .then(doMatch=>{
                    if(doMatch){
                        const token = jwt.sign({_id: savedUser._id}, JWT_SECRET)
                        const {_id, name, email} = savedUser
                        res.json({token, user: {_id, name, email}, message: "Successful login"})
                        
                    }
                    else{
                        return res.status(400).json({error: "Invalid credentials."})
                    }
                })
                .catch(err=>{
                    console.log(err)
                })
        })
})

router.get('/protected', requireLogin, (req, res)=>{
    res.send("hello user")
})

module.exports = router;