const mongoose =require("mongoose");
//here we are calling the database connection via database.js
const Schema =mongoose.Schema;

//schema name
const userschema = new Schema({
    firstname: { type:String, required:true, trim:true },
    lastname: {  type:String, required:true, trim:true },
    username: {  type:String, required:true, trim:true ,unique: true},
    email: {  type:String, required:true, trim:true ,unique: true},
    password: {  type:String, required:true },
    profilePic: {  type:String, default:"/images/profilePic.png" },
    likes : [{type: Schema.Types.ObjectId , ref: 'Post' }],
    retweets : [{type: Schema.Types.ObjectId , ref: 'Post' }],
    following: [{type: Schema.Types.ObjectId , ref: 'User' }],
    followers: [{type: Schema.Types.ObjectId , ref: 'User' }],
    //it ia an array of all the posts the user has retweeted

    
}, {timestamps: true});

var User = mongoose.model('User' , userschema);
module.exports = User;