var express = require("express");
var router  = express.Router();
var ListItem = require("../models/listitem");
var User     = require("../models/user");

router.get("/watch", function(req , res){
  if(req.user){  
    User.findById(req.user._id).populate("list").exec(function(err, user){
        if(err){
            console.log(err);
        }else{
            res.render("index", {user : user});
        }
    })
  }else{
     User.findOne({username: "Default"}).populate("list").exec(function(err, user){
         if(err){
             console.log(err);
         }
        res.render("index", {user: user});  
          
      })
  }
});





module.exports = router;