const express = require("express");
const router = express.Router();
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
const passport = require('passport');

//Load user Model

require('../models/User');
const User = mongoose.model('users');

//
require('../config/passport')(passport);

router.get('/login', (req, res) => {
  res.render('users/login');
});

router.get('/register', (req, res) => {
  res.render('users/register')
});

// Login User
router.post('/login', (req, res, next) => {
  const errors = [];
  if(req.body.password.length < 4) {
    errors.push({text: 'Passwords must be atleast 4 characters'});
  } 
  if(errors.length > 0) {
    res.render('users/login', {
      errors: errors,
      name: req.body.email
    });
  } else {
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: 'login',
      failureFlash: true
    }) (req, res, next);
  }
});


// Register Users
router.post('/register', (req, res, next) => {
    const errors = [];
    if(req.body.password1 != req.body.password2) {
      errors.push({text: 'Passwords dont match'});
    }
    if(req.body.password1.length < 4) {
      errors.push({text: 'Password must be atleast 4 characters'});
    }

    if(errors.length > 0) {
      res.render('users/register', {
        errors: errors,
        name: req.body.username,
        email: req.body.email
      });
    } else {
      User.findOne({email: req.body.email})
        .then(user => {
          if(user) {
            req.flash('error_msg', 'Email Already Registered');
            res.redirect('login');
          } else {
            const newUser = new User({
              name : req.body.username,
              email: req.body.email,
              password: req.body.password1
            });
            bcrypt.genSalt(12, (err, salt) => {
              bcrypt.hash(newUser.password, salt, (err, hash)=>{
                if(err) throw err;
                newUser.password = hash;
                newUser.save()
                  .then(user => {
                    req.flash('success_msg', 'Registration Successful, Login Now !!');
                    res.redirect('login');
                  })
                  .catch( err => {
                      console.log(err);
                  })
              });
            }); 
          }
        });
      
    }
});

// LOgout Process

router.get('/logout', (req, res)=>{
  req.logout();
  req.flash('success_msg',  'You are logged out.. !');
  res.redirect('/users/login');
});

module.exports = (router);