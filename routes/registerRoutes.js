const http = require('http');
const express =require('express');
// const { title } = require('process');
const app=express();

const router=express.Router();
//the arguments are port and the callback function
const bodyParser = require('body-parser');
const User = require ("../schemas/userschema");
const bcrypt = require("bcrypt");
const { resolveSoa } = require('dns');
//it hashes the password the user enters into the database

app.set("view engine","pug");
//using templates to show webpages, here we are using pug
app.set("views","views");


app.use(bodyParser.urlencoded({ extended: false}));
//telling the app to use bodyparser

router.get("/" , (req, res, next) => {
 
    res.status(200).render("register");
    //login=page we render
     // res.status(200).send("holaaa"); this is just a message
})

router.post("/" , async (req, res, next) => {
    //the data we submit in the form goes to the request body 
    //we need to request the data from the body 
    //hence we need to install body-parser
    //console.log(req.body);
    var firstname = req.body.firstname.trim();
    var lastname = req.body.lastname.trim();
    var username = req.body.username.trim();
    var email = req.body.email.trim();
    var password = req.body.password;

    var payload = req.body;
    //payload is just an object we pass through pages

    if(firstname && lastname && username && email && password) {
       //await can only be used for asynchronous functions
        var user = await User.findOne({
            $or: [
                { username: username },
                { email: email }
                //to check whether username or email is found in the database already to keep them unique
            ]
        })
        .catch((error) => {
            console.log(error);
            payload.errorMessage = "something went wrong";
            res.status(200).render("register",payload);
        });

        if(user == null ) {
            //no existing user found
            //insert new user into the database(collection)
            
            var data = req.body;
            data.password = await bcrypt.hash(password, 10);
            //that means hashing would be done 2^10 times
            User.create(data).then((user) => {
                req.session.user = user;
                return res.redirect('/');
            })
        }
        else {
            //existing user found
            if(email == user.email) {
               //email= mail you entered in the form 
               payload.errorMessage = "email id already in use";
                
            }
            else {
                payload.errorMessage = "username already in use";
            }
            res.status(200).render("register",payload);
        }
        }
    else {
        payload.errorMessage = "All fields don't have a valid value";
        res.status(200).render("register",payload);
    }   
    
   
})

module.exports=router;