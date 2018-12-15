const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const errorController = require("./controllers/error"); 
const User = require('./models/user'); 
const mongoose = require('mongoose'); 


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
  User.findById("5c1426769b421f5330d6136c")
    .then(user => {
      req.user = user;
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



// Get access to the client with mongoose
mongoose.connect(
  "mongodb+srv://Andres:Barcelona10@cluster0-3lj5r.mongodb.net/shop?retryWrites=true"
).then(res => {
  User.findOne().then(user => {
    if (!user) {
      const user = new User({
        name: "Andres",
        email: "andres@test.com",
        cart: {
          items: []
        }
      });
      user.save();  
    }
  }); 
  console.log("Connected to database successfully"); 
  app.listen(3000); 
}).catch(err => {
  console.log(err); 
});
