// Require
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = mongoose.model('User');

var router = express.Router();

// GET
router.get('/register', (req, res)=>{
    res.render('register');
});
router.get('/login', (req, res)=>{
    res.render('login');
});
router.get('/logout', (req, res)=>{
    req.logout();
    res.redirect('/');
});

//POST
router.post('/register', (req, res)=>{
    insertUser(req, res);
});
router.post('/login', (req, res, next)=>{
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        // failureFlash: true
    })(req, res, next);
});

//FUNCTIONS
function insertUser(req, res) {
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    let user = new User({
        name: name,
        email: email,
        username: username,
        password: password
    });
    
    bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(user.password, salt, function(err, hash){
            if (err) {
                console.log(err);
            }
            user.password = hash;
            user.save((err, doc)=>{
                if (!err) {
                      console.log('user: ' + user);
                      res.redirect('/users/login');
                } else {
                    console.log('Error insertProduct: ' + err);
                }
            });
        });
    });
}

module.exports = router;