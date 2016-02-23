var express = require("express");
var router  = express.Router();
var User = require("../models/user");
var passport = require("passport");

router.get("/" , function(req , res){
   res.render("landing"); 
});

router.get("/login" , function(req,res){
    res.render("login", {currentUser: req.user});
});

router.get("/register",function(req,res){
    res.render("register")
});

router.post("/register" , function(req,res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err , user){
        if(err){
            req.flash("error", err.message);
            res.redirect("register");
        }
        passport.authenticate("local")(req , res, function(){
            req.flash("success", "Welcome to TwitchMe!");
            res.redirect("/watch")
        });
    });
});

router.post("/login" , passport.authenticate("local", 
    {
        successRedirect: "/watch",
        failureRedirect: "/login"
        
    }), function(req, res){
});

router.get("/logout", function(req,res){
    req.logout();
    req.flash("success", "You are logged out.")
    res.redirect("/watch");
});

module.exports = router;

