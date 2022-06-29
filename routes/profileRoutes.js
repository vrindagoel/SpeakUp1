const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const User = require ("../schemas/userschema");


router.get("/" , (req, res, next) => {
    
    var payload = {
        pagetitle: req.session.user.username,
        userloggedin: req.session.user,
        userloggedinJson: JSON.stringify(req.session.user),
        profileuser: req.session.user,      
    }

    res.status(200).render("profilePage", payload);
})

async function getpayload(username, userloggedin)
{
    var user = await User.findOne({username: username});
    //try to find the user by username

    if(user == null)
    {
        //if user doesn't exist
        //try to find the user by id
        user = await User.findById(username);
        if(user == null)
        {
            return{
                pagetitle: "User Not Found",
                userloggedin: userloggedin,
                userloggedinJson: JSON.stringify(userloggedin),
            }
        }
    }

    return {
        pagetitle: user.username,
        userloggedin: userloggedin,
        userloggedinJson: JSON.stringify(userloggedin),
        profileuser: user,
    }
}

module.exports = router;