const express=require("express"),bodyParser=require("body-parser"),mongoose=require("mongoose"),session=require("express-session"),MongoStore=require("connect-mongo")(session),logger=require("morgan"),app=express();app.use(logger("dev")),mongoose.connect("mongodb://localhost:27017/snippets_db");var db=mongoose.connection;db.on("error",console.error.bind(console,"connection error: ")),app.use(session({secret:"snippets is the best",resave:!0,saveUninitialized:!1,store:new MongoStore({mongooseConnection:db})})),app.use(function(e,s,o){s.locals.currentUser=e.session.userId,o()}),app.use(bodyParser.json()),app.use(bodyParser.urlencoded({extended:!1})),app.use(express.static(__dirname+"/public")),app.set("view engine","pug"),app.set("views",__dirname+"/views");var routes=require("./routes/index");app.use("/",routes),app.use(function(e,s,o){console.log("File not found!!");var r=new Error("File Not Found");r.status=404,o(r)}),app.use(function(e,s,o,r){o.status(e.status||500),o.render("error",{message:e.message,error:{}})}),app.listen(3e3,function(){console.log("Express app listening on port 3000")});