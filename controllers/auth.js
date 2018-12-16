const User = require('../models/user'); 


exports.getLogin = (req, res, next) => {
  console.log(req.session.isLoggedIn); 
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false
  }); 
}

exports.postLogin = (req, res, next) => {
  User.findById("5c1426769b421f5330d6136c")
    .then(user => {
      // Starting a session 
      req.session.isLoggedIn = true; 
      req.session.user = user; // set the user on the session 
      req.session.save((err) => {
        console.log(err); 
        res.redirect("/"); 
      }); 
    })
    .catch(err => console.log(err));   
}

exports.postLogout = (req, res, next) => {
  // Clear session 
  req.session.destroy(err => {
    console.log(err); 
    res.redirect('/'); 
  }); 
}; 
