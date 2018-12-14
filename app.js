const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const errorController = require("./controllers/error"); 
const mongoConnect = require('./util/database').mongoConnect; 
const User = require('./models/user'); 

const app = express();
// register our ejs view engine 
app.set('view engine', 'ejs'); 
// tell express where to find them 
app.set('views', 'views'); 

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

// used to parse the body of incoming request 
app.use(bodyParser.urlencoded({extended: false}));
// serving static files --> request css
app.use(express.static(path.join(__dirname, 'public')));   
 
app.use((req, res, next) => {
  User.findById("5c12d49b51587c070219efdf")
    .then(user => {
      req.user = new User(user.name, user.email, user.cart, user._id);
      next();
    })
    .catch(err => console.log(err)); 
})

// Adding our admin routes as middleware 
// adding a base route segment to all of our adminRoutes 
app.use('/admin', adminRoutes); 
app.use(shopRoutes); 

// handling a 404 route --> catch all route 
app.use(errorController.get404); 

// Get access to the client from mongo 
mongoConnect((client) => {
  
  app.listen(4000); 
}); 
