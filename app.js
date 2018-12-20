const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const errorController = require("./controllers/error"); 
const User = require('./models/user'); 
const mongoose = require('mongoose'); 
const session = require('express-session'); 
const MongoDBStore = require('connect-mongodb-session')(session); 
const csrf = require('csurf'); // used to protect our views 
const flash = require('connect-flash'); 

const MONGODB_URI = 'mongodb+srv://Andres:Barcelona10@cluster0-3lj5r.mongodb.net/shop'; 
const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI, 
  collection: 'sessions'
}); 
const csurfProtection = csrf(); 
// register our ejs view engine 
app.set('view engine', 'ejs'); 
// tell express where to find them 
app.set('views', 'views'); 

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

// used to parse the body of incoming request 
app.use(bodyParser.urlencoded({extended: false}));
// serving static files --> request css
app.use(express.static(path.join(__dirname, 'public')));   
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false, 
    store: store
    })
); 
app.use(csurfProtection); 
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next(); 
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user; 
      next();
    })
    .catch(err => console.log(err));   
}); 

app.use((req, res, next) => {
  // Set variables for our views 
  res.locals.isAuthenticated = req.session.isLoggedIn; 
  res.locals.csrfToken = req.csrfToken(); 
  next(); 
}); 

// Adding our admin routes as middleware 
// adding a base route segment to all of our adminRoutes 
app.use('/admin', adminRoutes); 
app.use(shopRoutes); 
app.use(authRoutes); 

// handling a 404 route --> catch all route 
app.use(errorController.get404); 


// Get access to the client with mongoose
mongoose.connect(
  MONGODB_URI
).then(result => {
  console.log("Connected to database successfully"); 
  app.listen(3000); 
}).catch(err => {
  console.log(err); 
});
