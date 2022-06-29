const http = require('http');
const express =require('express');
const { title } = require('process');
const app=express();
const bodyParser = require('body-parser');
const bcrypt = require("bcrypt");
const User = require ("../schemas/userschema");

const router=express.Router();
//the arguments are port and the callback function
app.set("view engine","pug");
//using templates to show webpages, here we are using pug
app.set("views","views");

app.use(bodyParser.urlencoded({ extended: false}));
//telling the app to use bodyparser

router.get("/" , (req, res, next) => {
 
    res.status(200).render("login");
    //login=page we render
     // res.status(200).send("holaaa"); this is just a message
})

router.post("/" , async (req, res, next) => {

    var payload = req.body;
 
    if(req.body.loginusername && req.body.loginpass) {
        var user = await User.findOne({
            $or: [
                { username: req.body.loginusername },
                { email: req.body.loginusername }
                //to check whether username or email is found in the database already to keep them unique
            ]
        })
        .catch((error) => {
            console.log(error);
            payload.errorMessage = "something went wrong";
            res.status(200).render("login",payload);
        });

        if(user != null){
            var result = await bcrypt.compare(req.body.loginpass,user.password);
            if(result === true) {
                req.session.user =user;
                return res.redirect("/");
            }
        }
        payload.errorMessage = "Incorrect LogIn";
        res.status(200).render("login",payload);
    }
    payload.errorMessage = "All fields don't have a valid value";
    res.status(200).render("login");
    //login=page we render
})

module.exports=router;