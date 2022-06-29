const http = require('http');
const express =require('express');
const { title } = require('process');
const app=express();
const bodyParser = require('body-parser');
const bcrypt = require("bcrypt");
const User = require ("../schemas/userschema");

const router=express.Router();

app.use(bodyParser.urlencoded({ extended: false}));
//telling the app to use bodyparser

router.get("/" , (req, res, next) => {
 
    if(req.session) {
        req.session.destroy(() => {
            res.redirect("/login");
        })
    }
    
})



module.exports=router;