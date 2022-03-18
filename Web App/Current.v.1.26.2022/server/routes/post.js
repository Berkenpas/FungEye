const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model("Post");
const Votes = mongoose.model("Votes");
const User = mongoose.model("User");
const Mushrooms = mongoose.model("Mushrooms");
const Predictions = mongoose.model("Predictions");

//this router is for the voting system that finds pictures that have not been identified
router.get('/allpost', requireLogin,(req, res)=>{
    Post.find({voted: false})
        .populate('mushID')
    
        .then(posts=>{
            res.json(posts)
        })
        
        .catch(err=>{
                console.log(err)
        })
})

router.get('/allPostComplete', requireLogin,(req, res)=>{
    Post.find({voted: true})
        .populate('mushID')
    
        .then(posts=>{
            res.json(posts)
        })
        
        .catch(err=>{
                console.log(err)
        })
})

//router for finding all mushrooms within database for voting (+ prediction?)
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
router.post('/storevote',  requireLogin, async(req, res)=>{
    //console.log(JSON.stringify(req.body));
    console.log("Request body: " + JSON.stringify(req.body))
    const newVote = new Votes({
        user: req.user,
        image_id: req.body.image,
        vote: req.body.vote

        
    })
    newVote.save();

    //check if vote is majority
    //get all instances of votes for image
    //get all instances of votesz for image and choice and calculate 
    

    //set mushID to image based on majority

    //update user's score

    await Predictions.find({picture: req.body.image}, {mush_type: 1}) //finds mush_type where imageID is from vote
        .then(pred=>{
            console.log(JSON.stringify(pred))
            //check if vote is prediction
            if(req.body.vote == pred[0].mush_type){
                console.log("TRUE")

            }
        })
    
})


router.post('/createpost', requireLogin, async (req, res)=>{
    const {pic} = req.body
    if(!pic){
        return res.status(422).json({error: "Please upload an image."})
    }
    //continue on video 11 https://www.codersneverquit.in/courses/MERN-stack-Instagram-clone
    req.user.password = undefined;

    const post = new Post({
        image: pic, //this is the picture's url
        postedBy: req.user,
        date: new Date()
    })

    //get user's current score and add 2 points
    const userscore = req.user.score + 2;

    await User.updateOne(
        {_id: req.user._id},
        {$set:{
            score: userscore
        }}
    )
    
    
    await post.save().then(result =>{
        res.json({post: result})
    })
    .catch(err=>{
        console.log(err)
    })

    
})

//returns all user's posts
router.get('/mypost', requireLogin, (req, res)=>{
    Post.find({postedBy: req.user._id})
        .populate('postedBy', '_id name')
        .populate('mushID')
        .then(mypost=>{
            res.json(mypost)
        })
        .catch(err=>{
                console.log(err)
            

        })
})

//returns the specific user's votes with specific image
router.get('/uservotes', requireLogin, (req, res)=>{
    Votes.find({user: req.user._id, image_id: req.image})
        .then(myvote=>{
            res.json(myvote)
        })
        .catch(err=>{
            console.log(err)
        })
})

//returns the specific user's score
router.get('/userscore', requireLogin, (req, res)=>{
    User.find({_id: req.user._id}, {score: 1})
        .then(myscore=>{
            res.json(myscore[0].score)
        })
        .catch(err=>{
            console.log(err)
        })
})


module.exports = router


