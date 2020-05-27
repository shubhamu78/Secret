//jshint esversion:6

const express = require("express");
const ejs = require("ejs");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
require('dotenv').config();
const encrypt = require("mongoose-encryption");


const app = express();
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine','ejs');

mongoose.connect("mongodb://localhost:27017/userDB",{ useNewUrlParser: true ,useUnifiedTopology: true  });

const userSchema = new mongoose.Schema({
    email : String,
    password : String
});

// const secret = "Thisisourlittlesecret";
userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields: ["password"]});

const User = new mongoose.model("User",userSchema);


app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){
    const newUser = new User({
        email : req.body.username,
        password : req.body.password
    });

    newUser.save(function(err){
        if(err){
            console.log(err);
        }
        else{
            res.render("secrets");
        }
    });
});

app.post("/login",function(req,res){
    const username = req.body.username;
    const user_password = req.body.password;
    
    User.findOne(
        {email : username},
        function(err,result){
            if(err){
                console.log(err);
            }
            else{
            if(result){
                if(result.password === user_password){
                    res.render("secrets");
                }
                else{
                    console.log("Incorrrect Password");
                }
                        
                }
            
            else{
                res.render("register");
            }
        }
        });
});

app.listen(3000,function(){
    console.log("Server started");
});
