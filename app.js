const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");

const errorController = require("./controllers/error");
const shopController = require("./controllers/shop");
const isAuth = require("./middleware/is-auth");
const User = require("./models/user");


const app = express();

const store = new MongoDBStore({
  uri: MONGODB_URI, 
  collection: 'sessions'
}); 

const csrfProtection = csrf(); 

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images'); 
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname); 
  }
}); 

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || 
    file.mimetype === 'image/jpg' || 
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true); 
  } else {
    cb(null, false); 
  }
}

// register our ejs view engine 
app.set('view engine', 'ejs'); 
// tell express where to find them 
app.set('views', 'views'); 

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

// used to parse the body of incoming request 
app.use(bodyParser.urlencoded({extended: false}));
// Configure multer --> used to store images from incoming requests 
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image')); 
// serving static files --> request css
app.use(express.static(path.join(__dirname, 'public')));   
app.use('/images', express.static(path.join(__dirname, 'images')));   
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false, 
    store: store
    })
); 

app.use(flash());

app.use((req, res, next) => {
  // Set variables for our views 
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
}); 

app.use((req, res, next) => {
  if (!req.session.user) {
    return next(); 
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next(); 
      }
      req.user = user; 
      next();
    })
    .catch(err => { // Technical issue 
      next(new Error(err)); 
    });   
}); 

// Adding our admin routes as middleware 
// adding a base route segment to all of our adminRoutes 
app.post("/create-order", isAuth, shopController.postOrder); 
app.use(csrfProtection); 
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
}); 
app.use('/admin', adminRoutes); 
app.use(shopRoutes); 
app.use(authRoutes); 

app.get('/500', errorController.get500); 

// handling a 404 route --> catch all route 
app.use(errorController.get404); 

app.use((error, req, res, next) => {
  console.log("Here is your error: " + error); 
  res.status(500).render("500", {
    pageTitle: "Error",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn
  });
}); 


// Get access to the client with mongoose
mongoose.connect(
  MONGODB_URI
).then(result => {
  console.log("Connected to database successfully"); 
  app.listen(3000); 
}).catch(err => {
  console.log(err); 
});
