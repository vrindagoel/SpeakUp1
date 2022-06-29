const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require("bcrypt");
const User = require ("../schemas/userschema");
const app = express();

router.get("/:id" , (req, res, next) => {
    
    var payload = {
        pagetitle: "View Post",
        userloggedin: req.session.user,
        userloggedinJson: JSON.stringify(req.session.user),
        postid: req.params.id        
        }
        res.status(200).render("Post Page", payload);
})

module.exports = router;