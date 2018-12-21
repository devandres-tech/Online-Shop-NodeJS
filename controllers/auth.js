const User = require('../models/user'); 
const bcrypt = require('bcryptjs'); 
const nodemailer = require('nodemailer'); 
const sendGridTransport = require('nodemailer-sendgrid-transport'); 
const crypto = require('crypto'); 

const transporter = nodemailer.createTransport(sendGridTransport({
  auth: {
    api_key: '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'
  }
})); 

exports.getLogin = (req, res, next) => {
  let message = req.flash('error'); 
  if (message.length > 0) {
    message = message[0]; 
  } else {
    message = null; 
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage : message
  }); 
}

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email; 
  const password = req.body.password; 
  User.findOne({email: email})
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid email or password!'); // flash error
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
          req.flash("error", "Invalid email or password!");
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
        req.flash("error", "Email exists already!");
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
        res.redirect('/login'); // postLogin 
        return transporter.sendMail({
          to: email, 
          from: 'shop@node-complete.com',
          subject: 'signup succeeded',
          html: '<h1>You have successfully signed up to node shope!</h1>'
        });
    })
    .catch(err => console.log(err)); 
};

exports.postLogout = (req, res, next) => {
  // Clear session after logging out 
  req.session.destroy(err => {
    console.log(err); 
    res.redirect('/'); 
  }); 
}; 

exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/reset', {
    path: '/reset', 
    pageTitle: 'Reset Password', 
    errorMessage: message
  })
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err); 
      return res.redirect('/reset'); 
    }
    const token = buffer.toString(`hex`); 
    User.findOne({email: req.body.email})
      .then(user => {
        if (!user) {
          req.flash('error', 'No account with that email found'); 
          return res.redirect('/reset'); 
        }
        user.resetToken = token; 
        user.resetTokenExpiration = Date.now() + 3600000; 
        return user.save(); 
      })
      .then(result => {
        res.redirect('/'); 
        transporter.sendMail({
          to: req.body.email,
          from: 'shop@node-complete.com',
          subject: 'Password Reset',
          html: `
            <p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password</p>
            <p>This link will expire in one hour.</p>
          `
        });
      })
      .catch(err => console.log(err)); 
  }); 
}; 

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token; // getting it from the url 
  User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
    .then(user => {
      let message = req.flash('error');
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'New Password',
        errorMessage: message, 
        userId: user._id.toString(), 
        passwordToken: token
      }); 
    })
    .catch(err => {
      console.log(err); 
    })
}; 

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password; 
  const userId = req.body.userId; 
  const passwordToken = req.body.passwordToken; 
  let resetUser; 

  // reset user 
  User.findOne({
    resetToken: passwordToken, 
    resetTokenExpiration: {$gt: Date.now()}, 
    _id: userId
    })
    .then(user => {
      resetUser = user; 
      return bcrypt.hash(newPassword, 12); 
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword; 
      resetUser.resetToken = undefined; 
      resetUser.resetTokenExpiration = undefined; 
      return resetUser.save(); 
    })
    .then(result => {
      res.redirect('/login'); 
    })
    .catch(err => console.log(err)); 
}