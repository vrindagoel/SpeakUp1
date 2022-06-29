const http = require('http');
const express =require('express');
const app=express();
var cookieParser = require('cookie-parser');
const path = require('path'); 
const port =3000;
//localhost:3000 server port
const mongoose = require("./database");

const middleware = require("./middleware");
const server=app.listen(port,() => {
    //anonymous function
    console.log("server listening to port " + port);
});
//the arguments are port and the callback function

const bodyParser = require('body-parser');
const session = require("express-session");
app.set("view engine","pug");
//using templates to show webpages, here we are using pug
app.set('views','views');

app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//sessions
app.use(session({
    secret : "session secret",
    resave : true,
    saveUninitialized : false
}) )


//routes
const loginRoutes = require('./routes/loginRoutes');
const registerRoutes = require('./routes/registerRoutes');
const logoutRoute = require('./routes/logout');
const profileRoute = require('./routes/profileRoutes');

app.use('/login' , loginRoutes);
app.use('/register', registerRoutes);
app.use('/logout' , logoutRoute);
app.use('/profile' , middleware.requirelogin,profileRoute);

//api routes
const postsApiRoutes = require('./routes/api/posts');
app.use('/api/posts' , postsApiRoutes);

app.get("/" , middleware.requirelogin, (req, res, next) => {
    var payload = {
        pageTitle: "Home",
        userLoggedIn : req.session.user,
        userLoggedInjs : JSON.stringify(req.session.user)
    }
    //when we are goint to access the site of root level i.e /we are going to execute this function
    res.status(200).render("home", payload);
    //home=page we render
    //payload= the data we are going to send into it
})
