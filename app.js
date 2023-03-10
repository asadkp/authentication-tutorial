//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
// const encrypt = require('mongoose-encryption'); //Level 2
// const md5 = require('md5'); //Level 3
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();


mongoose.set('strictQuery', true);

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
})

// userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']}); //Level 2

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res)=>{
    res.render("home");
})

app.get("/login", (req, res)=>{
    res.render("login");
})

app.get("/register", (req, res)=>{
    res.render("register");
})

app.post("/register", (req, res)=>{

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser = new User ({
            email: req.body.username,
            password: hash
        })
        newUser.save((err)=>{
            if(err) {
                console.log("Error : " + err);
            } else {
                res.render("secrets");
            }
        });
    });


})

app.post("/login", (req, res)=>{
    const userName = req.body.username;
    const userPass = req.body.password;
    User.findOne({email: userName}, (err, foundUser)=> {
        bcrypt.compare(userPass, foundUser.password, function(err, result) {
            if(result==true) {
                res.render("secrets");
            } else {
                res.redirect("/login")
            }
        });

    })
})

app.listen(3000, ()=>{
    console.log("Server Running on Port 3000");
})