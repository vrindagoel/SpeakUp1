//requirelogin:name of the function
exports.requirelogin = (req, res, next) => {
    if(req.session && req.session.user)
    {
        return next();
    }
    else{
        return res.redirect('/login');
    }
}