const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
// tell express we want to compile dynamic content 
app.set('view engine', 'ejs'); 
// tell express where to find them 
app.set('views', 'views'); 

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");

// used to parse the body of incoming request 
app.use(bodyParser.urlencoded({extended: false}));
// serving static files --> request css
app.use(express.static(path.join(__dirname, 'public')));   
 
// Adding our admin routes as middleware 
// adding a base route segment to all of our adminRoutes 
app.use('/admin', adminData.routes); 
app.use(shopRoutes); 

// handling a 404 route --> catch all route 
app.use((req, res, next) => {
 res.status(404).render('404', {pageTitle: 'Page Not Found'}); 
}); 

// create server and listen on port 3000
app.listen(3000); 