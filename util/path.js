const path = require('path'); 

// This is the path that is responsible for the fact that our application is 
// running 
module.exports = path.dirname(process.mainModule.filename); 