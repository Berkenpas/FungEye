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
var prediction;
var confidence;

//this router is for the voting system that finds pictures that have not been identified
router.get('/allpost', requireLogin,(req, res)=>{
    console.log("/allpost");
    Post.find({voted: false})
        .populate('mushID')
    
        .then(posts=>{
            //console.log(posts)
            res.json(posts)
            
        })
        
        .catch(err=>{
                console.log(err)
        })
})

//router for finding all mushrooms within database for voting (+ prediction?)
router.get('/allmush', requireLogin, (req, res)=>{
    console.log("/allmush");
    Mushrooms.find({ _id: { $ne: "61e3576650a1d7fbc5f2ac7d" } }) //finds all mushroom species
        .populate('latin')
        .then(musher=>{
            res.json(musher)
        })
        .catch(err=>{
            console.log(err)
        })
})

//find totalvotes
router.post('/findvotes', requireLogin, (req, res)=>{
    console.log("/findvotes");
    Votes.find({image_id: req.body.image})
            .then(result=>{
                console.log("TOTAL VOTES : " + result)
                res.json(result)})
            .catch(err=>{
                console.log(err)
            })
})
//find spcific votes for user
router.get('/finduservotes', requireLogin, (req, res)=>{
    console.log("/finduservotes");
    Votes.find({user: req.user}, {image_id: 1, _id:0})
            .then(result=>{
                console.log("vote image : " + JSON.stringify(result))
                res.json(result)})
            .catch(err=>{
                console.log(err)
            })
})

//stores votes
router.post('/storevote',  requireLogin, (req, res)=>{
    //console.log("Request body: " + JSON.stringify(req.body))
    console.log("/storevote");
    const newVote = new Votes({
        user: req.user,
        image_id: req.body.image,
        vote: req.body.vote
        
    })
    newVote.save().then(result =>{
        res.json({post: result})
    })
    .catch(err=>{
        console.log(err)
    })
})

//updates after image voting has finished
router.post('/updateafter', requireLogin, async(req, res)=>{
    console.log("/updateafter");
    var voteTotal = 0;
    var voteCounts = new Array();
    var pastVotes = new Array();
    var count = 0; 
    var maxCount = 0;
    var maxVoteID;



    await Votes.find({image_id: req.body.image})
            .then(result=>{
                voteTotal = result.length;
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
                
                Predictions.find({picture: req.body.image}) //finds mush_type where imageID is from vote
                .then(pred=>{
                        prediction = pred[0].mush_type;
                        confidence = pred[0].confidence;
                      
                }).then(function(){
                    
                        const voteupdate = new VoteResults({
                        picID: req.body.image, 
                        maxVote: maxCount,
                        voteResult: maxVoteID,
                        prediction: prediction,
                        conf: confidence
                    })
                    voteupdate.save().then(result =>{
                        res.json({update: result})
                    })
                    .catch(err=>{
                        console.log(err)
                    })
                })
                .catch(err=>{
                    console.log(err)
                })
                
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
    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    //find all users in DB
    await User.find()
    .then((users)=>{

    
        users.forEach(user => {
            let currUser = user;
            //console.log(user);
            var userscore = currUser.score;
            //console.log(userscore);
            //find user's vote for this image and compare to voteresults collection; update score
            Votes.find({user: currUser._id, image_id: req.body.image}, {vote: 1})
            .then(res =>{
                console.log("Checking vote for " + currUser.name)
                //console.log(res)
                if(res.length != 0){
                    let uservote = res[0].vote;
                    VoteResults.find({picID: req.body.image}, {voteResult: 1})
                    .then(res2=>{
                        console.log("Checking majority for " + currUser.name)
                        //console.log(res2)
                        if(uservote.equals(res2[0].voteResult)){
                            console.log("IS MAJORITY")
                            userscore = userscore + 1;
                            //console.log("Score: " + userscore)
                        }
                        else{
                            console.log("NOT MAJORITY")
                            userscore = userscore + 0.5;
                            //console.log("Score: " + userscore)
                        }
                    })
                    .then(function(){
                        Predictions.find({picture: req.body.image}) //finds mush_type where imageID is from vote
                        .then(pred=>{
                            prediction = pred[0].mush_type;
                            confidence = pred[0].confidence;
                            console.log("Checking prediction for " + currUser.name)
                            //console.log(prediction)
                            //console.log(uservote)
                            //check if vote is prediction
                            if(uservote.equals(prediction)){
                                console.log("TRUE")
                                userscore = userscore + 1;
                                //console.log("Score: " + userscore)
                            }
                            else{
                                console.log("FALSE")
                                //console.log("Score: " + userscore)
                            }
                        })
                        .then(function(){
                            console.log("Updating score for " + currUser.name)
                            //console.log("Score: " + userscore)
                            //console.log("User " + currUser)
                            const user_score = userscore;
                            User.updateOne(
                                {_id: currUser._id},
                                {$set:{score : user_score}},
                                function (err, result) {
                                    if(err) throw err;
                                    //console.log(result);
                                }
                            )
                        })
                        .catch(err=>{
                            console.log(err);
                        })
                    })
                    .catch(err=>{
                        console.log(err);
                    })
                    
                }
            })
            .catch(error=>{
                    console.log(error)
             })

        })
    })
    
    
})


router.post('/createpost', requireLogin, async (req, res)=>{
    console.log("/createpost");
    const {pic} = req.body
    if(!pic){
        return res.status(422).json({error: "Please upload an image."})
    }
    //continue on video 11 https://www.codersneverquit.in/courses/MERN-stack-Instagram-clone
    req.user.password = undefined;

    console.log("Created post at: " + Date.now())
    const post = new Post({
        image: pic, //this is the picture's url
        postedBy: req.user,
        date: new Date(Date.now())
    })

    //get user's current score and add 2 points
    const userscore = req.user.score + 2;

    console.log(req.user)
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
    console.log("/mypost");
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


//returns the specific user's score
router.get('/userscore', requireLogin, (req, res)=>{
    console.log("/userscore");
    User.find({_id: req.user._id}, {score: 1})
        .then(myscore=>{
            res.json(myscore[0].score)
        })
        .catch(err=>{
            console.log(err)
        })
})

//returns voting results
router.get('/voteresults', requireLogin, (req, res)=>{
    console.log("/voteresults");
    VoteResults.find()
        .populate('voteResult')
        .populate('picID')
        .populate('prediction')
    
        .then(posts=>{
            res.json(posts)
            //console.log(posts)
        })
        
        .catch(err=>{
                console.log(err)
        })
})

//returns image time
router.get('/time', requireLogin, async(req, res)=>{
    console.log("/time");
    
    Post.aggregate(
        [
            {$match: {voted:false}},
          {
            $project: {
               milliseconds: { $subtract: ["$date", new Date("1970-01-01T00:00:00")] }
            }
          }
        ]
    )
    .then(posts=>{
        let imagedate = Date.now(); 
        res.json(posts)
    })
    .catch(err=>{
            console.log(err)
    })
})

router.post('/updatewallet', requireLogin, async (req, res)=>{
    console.log("/updatewallet");
    const {value} = req.body.algo_wallet;
    console.log("Request body: " + value);
    await User.updateOne(
        {_id: req.user._id},
        {$set:{
            algo_wallet: req.body.algo_wallet
        }}
    )
    .catch(err=>{
        console.log(err)
    })

    console.log("Updated user wallet: " + Date.now())
})

//returns the specific user's wallet
router.get('/mywallet', requireLogin, (req, res)=>{
    console.log("/mywallet");
    User.find({_id: req.user._id})
        .then(mywallet=>{
            res.json(mywallet[0].algo_wallet)
        })
        .catch(err=>{
            console.log(err)
        })
})



module.exports = router


