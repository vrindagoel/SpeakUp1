const mongoose =require("mongoose");
//here we are calling the database connection via database.js
const Schema =mongoose.Schema;

//schema name
const PostSchema = new Schema({
    
    content : {type: String , trim: true},
    postedBy : {type: Schema.Types.ObjectId , ref: 'User' },
    //ref is telling that objectid belongs to the User Table
    pinned : {type: Boolean},
    likes : [{type: Schema.Types.ObjectId , ref: 'User' }], 
    retweetusers : [{type: Schema.Types.ObjectId , ref: 'User' }],
    retweetdata : {type: Schema.Types.ObjectId , ref: 'Post' }

}, {timestamps: true});

// in line 12 likes:[{...}] it means likes is a user object
var Post = mongoose.model('Post' , PostSchema);
module.exports = Post;


//retweetusers: an array