const User = require('../models/user'); 
const bcrypt = require('bcryptjs'); 


exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false
  }); 
}

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email; 
  const password = req.body.password; 
  User.findOne({email: email})
    .then(user => {
      if (!user) {
        return res.redirect('/login'); 
      }
      // Validate password if user exits 
      bcrypt.compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user; // set the user on the session 
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/");
            }); 
          }
          res.redirect('/login'); 
        })
        .catch(err => {
          console.log(err); 
          res.redirect('/login'); 
        })
    })
    .catch(err => console.log(err));   
}

exports.postSignup = (req, res, next) => { 
  const email = req.body.email; 
  const password = req.body.password; 
  const confirmPassword = req.body.confirmPassword; 
  User.findOne({email: email})
    .then(userObj => {
      if (userObj) {
        return res.redirect('/signup'); 
      }
      // Hashing a password returns a promise 
      return bcrypt.hash(password, 12)
       .then(hashedPassword => {
        const user = new User({
          email: email,
          password: hashedPassword,
          cart: { items: [] }
        });
        return user.save();
      })
    })
    .then(result => {
      res.redirect('/login'); 
    })
    .catch(err => console.log(err)); 
};

exports.postLogout = (req, res, next) => {
  // Clear session 
  req.session.destroy(err => {
    console.log(err); 
    res.redirect('/'); 
  }); 
}; 
