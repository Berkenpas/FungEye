const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model("Post");
const Votes = mongoose.model("Votes");
const User = mongoose.model("User");
const Mushrooms = mongoose.model("Mushrooms");

//this router is for the voting system that finds pictures that have not been identified
router.get('/allpost', requireLogin,(req, res)=>{
    Post.find({$or: [{mushID:{$exists:false}}, {mushID:"61e3576650a1d7fbc5f2ac7d"}]})
        .populate('mushID')
    
        .then(posts=>{
            res.json(posts)
        })
        
        .catch(err=>{
                console.log(err)
        })
})

//router for finding all mushrooms within database
router.get('/allmush', requireLogin, (req, res)=>{
    Mushrooms.find({ _id: { $ne: "61e3576650a1d7fbc5f2ac7d" } }) //finds all mushroom species
        .populate('latin')
        .then(musher=>{
            res.json(musher)
        })
        .catch(err=>{
            console.log(err)
        })
})

//stores votes
router.post('/storevote',  requireLogin, (req, res)=>{
    console.log(JSON.stringify(req.body));

    const newVote = new Votes({
        user: req.user,
        image_id: req.body.image,
        vote: req.body.vote
        
    })
    newVote.save();
    
})


router.post('/createpost', requireLogin, (req, res)=>{
    const {pic} = req.body
    //console.log("title" + title, "body" + body, "url" + pic)
    if(!pic){
        return res.status(422).json({error: "Please upload an image."})
    }
    //continue on video 11 https://www.codersneverquit.in/courses/MERN-stack-Instagram-clone
    req.user.password = undefined;

    const post = new Post({
        image: pic, //this is the picture's url
        postedBy: req.user,
        mushID: "61e3576650a1d7fbc5f2ac7d" //automatically make unknown unless ai gets it, will be nothing, then added after ai 
    })
    post.save().then(result =>{
        res.json({post: result})
    })
    .catch(err=>{
        console.log(err)
    })
})


router.get('/mypost', requireLogin, (req, res)=>{

    Post.find({postedBy: req.user._id})
        .populate('postedBy', '_id name')
        .populate('mushID')
        .then(mypost=>{
            res.json(mypost)
        })
        .catch(err=>{

            const {mush} = req.mushrooms

            if(!mush){
                //set objectID to unknown
                Post.updateOne(
                    {_id: req.body._id},
                    {$set:{
                        mushID: "61e3576650a1d7fbc5f2ac7d"
                    }}
                )
            }
            else{
                console.log(err)
            }

        })
})


module.exports = router


