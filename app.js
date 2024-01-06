require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email : String,
    password : String
});

userSchema.plugin(encrypt,{secret: process.env.SECRET , encryptedFields: ["password"]});

const User = new mongoose.model("user",userSchema);

app.get("/",function(req,res){
    res.render("home");
})

app.get("/register",function(req,res){
    res.render("register");
})

app.get("/login",function(req,res){
    res.render("login");
})

app.post("/register",function(req,res){
    const newuser = new User({
        email:req.body.username,
        password:req.body.password
    });
    newuser.save().then(result=>{res.render("secrets");},err=>{console.log(err);});
})

app.post("/login",function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email:username}).then(result=>{if(result.password===password)
    {  
        res.render("secrets");
    }},err=>{console.log(err);})
})


app.listen(3000,function(){
    console.log("server started on port 3000");
})