const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model("Post");
const Votes = mongoose.model("Votes");
const User = mongoose.model("User");
const Mushrooms = mongoose.model("Mushrooms");
const Predictions = mongoose.model("Predictions");
const VoteResults = mongoose.model("VoteResults");

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
    //console.log("Request body: " + JSON.stringify(req.body))
    const newVote = new Votes({
        user: req.user,
        image_id: req.body.image,
        vote: req.body.vote
        
    })
    await newVote.save();

    //check if vote is majority
    //get all instances of votes for image 
    var voteTotal = 0;
    var voteCounts = new Array();
    var pastVotes = new Array();
    var count = 0; 
    var maxCount = 0;
    var maxVoteID;
    var userscore = req.user.score;

    await Votes.find({image_id: req.body.image})
            .then(result=>{
                //console.log("RESULT: " + JSON.stringify(result))
                voteTotal = result.length;
                //console.log(voteTotal)
                //create 2d array
                function contains(array, object) {
                    var i = array.length;
                    while (i--) {
                       if (array[i].equals(object)) {
                           return true;
                       }
                    }
                    return false;
                }

                //FINDS MAX VOTE
                for(let i =0; i <= voteTotal-1; i++ ){
                    const currentVote = result[i].vote;
                    if(contains(pastVotes, currentVote)){
                        //console.log("ALREADY EXISTS")
                        continue;
                    }
                    else{
                        count = 1;
                        for(let j =i+1; j <= voteTotal-1; j++){
                            if(result[j].vote.equals(currentVote)){
                                count++;
                            }
                        }
                        pastVotes.push(currentVote);
                        
                        if(count >= maxCount){
                            maxVoteID = currentVote;
                            maxCount = count; 
                        }
                        voteCounts.push([currentVote, count])
                        count = 0;
                    }
                    
                }
                //console.log(pastVotes)
                //console.log(voteCounts);
                //update voteresults collection
                const voteupdate = new VoteResults({
                    picID: req.body.image, 
                    maxVote: maxCount,
                    voteResult: maxVoteID
                })
                voteupdate.save().then(result =>{
                    res.json({update: result})
                })
                .catch(err=>{
                    console.log(err)
                })
                //console.log("Max count: " + maxCount + " Max vote: " + JSON.stringify(maxVoteID))
            })
            .catch(err=>{
                console.log(err)
            })
    
    //set mushID to image based on majority
    await Post.updateOne(
        {_id: req.body.image},
        {$set:{
            mushID: maxVoteID,
            voted: true
        }}
    )
    //find user's vote for this image and compare to voteresults collection; update score
    await Votes.find({user: req.user}, {vote: 1})
                .then(res =>{
                    let uservote = res[0].vote;
                    VoteResults.find({voteResult: uservote})
                        .then(res2=>{
                            if(res2.length == 1){
                                console.log("IS MAJORITY")
                                userscore = userscore + 1;
                            }
                            else{
                                console.log("NOT MAJORITY")
                                userscore = userscore + 0.5;
                            }
                        })
                        .catch(err=>{
                            console.log(err);
                        })
                })
                .catch(error=>{
                    console.log(error)
                })


    await Predictions.find({picture: req.body.image}, {mush_type: 1}) //finds mush_type where imageID is from vote
        .then(pred=>{
            //console.log(JSON.stringify(pred))
            //check if vote is prediction
            if(req.body.vote == pred[0].mush_type){
                console.log("TRUE")
                //update score 
                userscore = userscore + 1;
            }
            else{
                console.log("FALSE")
            }
        })
        .catch(err=>{
            console.log(err)
        })

    await User.updateOne(
        {_id: req.user._id},
        {$set:{
            score: userscore
        }}
    )
    
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


