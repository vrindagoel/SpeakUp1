const http = require('http');
const express =require('express');
const { title } = require('process');
const app=express();
const bodyParser = require('body-parser');
const User = require ("../../schemas/userschema");
const Post = require ("../../schemas/PostSchema");
const { populate } = require('../../schemas/userschema');

const router=express.Router();
//the arguments are port and the callback function
app.use(bodyParser.urlencoded({ extended: false}));
//telling the app to use bodyparser


//for displaying the posts in profile page from profile.js: function loadposts()
// router.get("/" , async (req,res,next) => {
//     var results = await getPosts(searchObj);
//     res.status(200).send(results);
// })

//for preventing the previous posts to disappear on refresh of the page 
router.get("/" , async (req, res, next) => {
    Post.find()
    .populate("postedBy") 
    .populate("retweetdata")
    .sort({"createdAt" : -1})//sorted such that the last post comes first
    .then( async (results) => {
        results = await User.populate(results,{path:"retweetdata.postedBy"});
        res.status(200).send(results);
    })
    .catch((error) => {
        console.log(error);
        res.sendStatus(400);
    })  
    
    //populate function means to replace the user ObjectId field with the whole document consisting of all the user data.
    
})

//for posting the posts
router.post("/" , async (req, res, next) => {
    //checking if the content(from common.js line 26) is empty or not
     if(!req.body.content)
     {
         console.log("content param not sent with request");
         //400 is http status for bad request
         return res.sendStatus(400);
     }

     //now we know that we have the data we need
     var postData = {
        content: req.body.content,
        postedBy : req.session.user,
     }
     

     Post.create(postData)
     .then(async newPost => {
        
         //this is gonna give us the new post

         //via this command we not just ahve the id of the user
         // but also all the details of the user who has posted it
         newPost = await User.populate(newPost , { path : "postedBy" })
         //201: https stauts for created
         res.status(201).send(newPost);
     })
     .catch((error) => {
         console.log(error);
         res.sendStatus(400);
     })

   
})

//for updating the posts' likes
router.put("/:id/like" , async (req, res, next) => {

    var postid = req.params.id;
    var userid= req.session.user._id;

    //now we are checking if the user wants to like or dislike the post
    //if this postid is mentioned in the userschema like then it is already liked and the user wants to dislike it
    //if it's not there then it means the user wants to like it
    var isliked = req.session.user.likes && req.session.user.likes.includes(postid);
    var option = isliked ? "$pull" : "$addToSet";

     //insert user likes: reflecting in userschema that he has liked what posts

    req.session.user = await User.findByIdAndUpdate(userid , { [ option ] : { likes:postid } } , {new: true})
    .catch((error) => {
        console.log(error);
        res.sendStatus(400);
    })
    //userid=id of the document we want to update
    //postid=value you want to update
     //mongodb function:addtoset,pull
     //addtoset is used to add
     //pull is used to remove
     //new: true so that it returns an updated document to req.session.user
     
     //insert post likes: reflecting in postschemawhat posts have been liked by what userid

     var post = await Post.findByIdAndUpdate(postid , { [ option ] : { likes: userid } } , {new: true})
    .catch((error) => {
        console.log(error);
        res.sendStatus(400);
    })
    res.status(200).send(post);   
})

//for retweets
router.post("/:id/retweet" , async (req, res, next) => {
  
    var postid = req.params.id;
    var userid= req.session.user._id;

    //try and delete retweet
    //if we can delete it then it means it was essentially not retweeted
    //and if we cannot delete it => deletepost==null and => retweet it
    var deletepost = await Post.findOneAndDelete({ postedBy : userid , retweetdata : postid}) 
    .catch((error) => {
        console.log(error);
        res.sendStatus(400);
    })
    
    var option = deletepost!= null ? "$pull" : "$addToSet";
   
    var repost = deletepost;
    //if repost == null , we are creating a post
    if(repost ==  null) {
        repost = await Post.create({postedBy: userid, retweetdata : postid})
        .catch((error) => {
            console.log(error);
            res.sendStatus(400);
        })
    }

    req.session.user = await User.findByIdAndUpdate(userid , { [ option ] : { retweets : repost._id } } , {new: true})
    .catch((error) => {
        console.log(error);
        res.sendStatus(400);
    })

     var post = await Post.findByIdAndUpdate(postid , { [ option ] : { retweetusers : userid } } , {new: true})
    .catch((error) => {
        console.log(error);
        res.sendStatus(400);
    })

    res.status(200).send(post);   

   
})

//for deleting the posts
router.delete("/:id" , async (req, res, next) => {
    Post.findByIdAndDelete(req.params.id)
    .then(() => {
        res.sendStatus(202);
    })
    .catch((error) => {
        console.log(error);
        res.sendStatus(400);
    })
})

async function getPosts(filter) {
    var results = await Post.find(filter)
    .populate("postedBy")
    .populate("retweetdata")
    .sort({"createdAt" : -1})
    .catch(error => console.log(error))

    results = await User.populate(results,{path:"replyTo.postedBy"});
    return await User.populate(results,{path:"retweetdata.postedBy"});
}

module.exports=router;