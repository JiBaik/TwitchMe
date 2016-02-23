var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var ListItem = require("../models/listitem");



var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    list:{ 
        type:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "ListItem"
        }],
    
        validate: [arrayLimit, "List exceeds the limit of 10"]
    }
    
});

function arrayLimit(val) {
  return val.length <= 10;
}

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);



