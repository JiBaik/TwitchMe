var express = require("express");
var router  = express.Router();
var ListItem = require("../models/listitem");
var User     = require("../models/user");

//Check if streamname exists in list
function arrayStreamNameCheck(myArray, searchTerm) {
    for(var i=0; i<myArray.length;i++) {
        if (myArray[i].streamName === searchTerm) return true;
    }
    return false;
}
//check if rank exists in list
function arrayRankCheck(myArray, searchTerm) {
    for(var i=0; i<myArray.length;i++) {
        if (myArray[i].rank === Number(searchTerm)) return true;
    }
    return false;
}
//check if there is a user logged in
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You must be logged in to do that!");
    res.redirect("/login");
}

router.get("/additem" , function(req, res){
   res.render("new"); 
});

//-----------------CREATE
router.post("/additem", isLoggedIn, function(req,res){
    User.findById(req.user._id).populate("list").exec(function(err , user){
        if(err){
            console.log(err);
            res.redirect("/additem");
        }else{
            //prevent duplicates based on username
           if(!arrayStreamNameCheck(user.list , req.body.listitem.streamName) && !arrayRankCheck(user.list , req.body.listitem.rank)){
                ListItem.create(req.body.listitem, function(err, newitem){
                if(err){
                    console.log(err);
                }else{
                    user.list.push(newitem);
                    user.save();
                    res.redirect("/watch"); 
                }
                });
            }else{
               req.flash("error", "One of those slots might be filled!");
               res.redirect("/additem");
           }
        }
    });
});

//-----------------EDIT
router.put("/edititem/:itemId", isLoggedIn, function(req, res){
   User.findById(req.user._id).populate("list").exec( function(err, user){
        if(err){
           console.log(err);
       }else{
               // if only the rank exists update the streamname
             if(arrayRankCheck(user.list ,req.body.listitem.rank) &&!arrayStreamNameCheck(user.list , req.body.listitem.streamName)){
                  ListItem.findByIdAndUpdate(req.params.itemId, {$set: {"streamName": req.body.listitem.streamName}}, function(err){
                   if(err){
                       console.log(err);
                   } else{
                       res.redirect("/watch");
                   }
                });
            //if only the streamname exists update rank
             }else if(arrayStreamNameCheck(user.list , req.body.listitem.streamName) && !arrayRankCheck(user.list ,req.body.listitem.rank)){ 
                ListItem.findByIdAndUpdate(req.params.itemId, {$set: {"rank":req.body.listitem.rank}}, function(err){
                   if(err){
                       console.log(err);
                   } else{
                       res.redirect("/watch");
                   }
                });
                
                //if neither exists replace both
             }else if (!arrayStreamNameCheck(user.list , req.body.listitem.streamName) && !arrayRankCheck(user.list , req.body.listitem.rank)){
                  ListItem.findByIdAndUpdate(req.params.itemId, req.body.listitem, function(err){
                   if(err){
                       console.log(err);
                   } else{
                       res.redirect("/watch");
                   }
                });
             }else{
                  req.flash("error","That already exists.");
                 res.redirect("/watch");
             }
       }
   });
   
});

//-----------------DESTROYYYYYY
router.delete("/deleteitem/:itemId",isLoggedIn, function(req, res){
    ListItem.findByIdAndRemove(req.params.itemId, function(err){
        if(err){
            console.log(err);
        } else {
            res.redirect("/watch");
        }
    })
});

module.exports = router;