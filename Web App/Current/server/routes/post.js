const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model("Post");

router.get('/allpost', requireLogin,(req, res)=>{
    Post.find()
        .populate('postedBy', '_id name')
        .then(posts=>{
            res.json(posts)
        })
        .catch(err=>{
            console.log(err)
        })
})


router.post('/createpost', requireLogin, (req, res)=>{
    const {title, body, pic} = req.body
    //console.log("title" + title, "body" + body, "url" + pic)
    if(!title || !body || !pic){
        return res.status(422).json({error: "Please add all fields."})
    }
    //continue on video 11 https://www.codersneverquit.in/courses/MERN-stack-Instagram-clone
    req.user.password = undefined;

    const post = new Post({
        title,
        body,
        image: pic, 
        postedBy: req.user
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
        .then(mypost=>{
            res.json(mypost)
        })
        .catch(err=>{
            console.log(err)
        })
})


module.exports = router


