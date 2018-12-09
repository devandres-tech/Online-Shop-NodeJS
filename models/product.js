// Defining the product model 
const fs = require('fs'); 
// Path file system that works on all operating systems 
const path = require('path'); 

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data', 'products.json' // create a file in the data folder named products.json
);

const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      return cb([]);
    }
    cb(JSON.parse(fileContent));
  }); 
}

/** Model for a Product */
module.exports = class Product {
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    this.id = Math.random().toString(); 
    getProductsFromFile(products => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log(err);
      });  
    }); 
  }

  static fetchAll(cb) {
   getProductsFromFile(cb); 
  }

  static findById(id, cb) {
    getProductsFromFile(products => {
      const product = products.find(p => p.id === id); 
      cb(product); 
    }); 
  }
}