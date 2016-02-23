var mongoose = require("mongoose");


var listitemSchema = new mongoose.Schema({
   streamName: String,
    rank: Number
}); 


module.exports = mongoose.model("ListItem", listitemSchema);
