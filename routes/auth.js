const express = require("express");
const router = express.Router();
const authController = require('../controllers/auth'); 
const { check } = require('express-validator/check'); 
const User = require('../models/user'); 


router.get('/login', authController.getLogin); 

router.get("/signup", authController.getSignup); 

router.post('/login', 
  check('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  check('password', 'Invalid password')
    .isLength({min: 5})
    .isAlphanumeric()
    .trim(), // remove excess white space    
  authController.postLogin); 

router.post('/signup', 
  check('email', 'Password has to be valid')
    .isEmail()
    .withMessage("Please enter a valid email") 
    .custom((value, {req}) => {
      return User.findOne({ email: value })
      .then(userObj => {
        if (userObj) {
          return Promise.reject('Email already exits'); 
        }
    });
   })
   .normalizeEmail(),
  check('password', 'Please enter a password with only numbers and text and at least 5 characters')
    .isLength({min: 5})
    .isAlphanumeric()
    .trim(),
  check('confirmPassword')
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match'); 
      }
      return true; 
    }),  
  authController.postSignup); 

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset); 

router.post('/reset', authController.postReset); 

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword); 


module.exports = router; 