var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    User        = require("./models/user"),
    ListItem    = require("./models/listitem"),
    flash       = require("connect-flash"),
    methodOverride        = require("method-override"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose")

//routes
var   watchRoutes           = require("./routes/watch"),
      editlistRoutes        = require("./routes/editlist"),
      authRoutes            = require("./routes/auth")

      //mongoose.connect("mongodb://localhost/twitchme");
mongoose.connect("mongodb://Ji:riley@ds062898.mongolab.com:62898/twitchme");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());

//Passport configuration
app.use(require("express-session")({
    secret: "yoyo",
    resave: false,
    saveUninitialized: false,
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash('success');
    next();
})

// ListItem.remove({},function(){});
// User.remove({},function(){});

app.use(authRoutes);
app.use(watchRoutes);
app.use(editlistRoutes);

app.get("*", function(req, res){
  res.render("error");
});

var port = process.env.PORT || 3000;

if(process.env.IP){
  app.listen(port, process.env.IP, function(){
     console.log("You're online");
  });
}else{
  app.listen(port, function(){
   console.log("You're online");
  });
}

