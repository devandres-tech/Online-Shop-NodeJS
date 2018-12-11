// Defining the product model 
const fs = require('fs'); 
// Path file system that works on all operating systems 
const path = require('path'); 
const Cart = require('./cart'); 

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
  constructor(id, title, imageUrl, description, price) {
    this.id = id; 
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile(products => {
      if (this.id) {
        // Update existing product 
        const existingProductIndex = products.findIndex(prod => prod.id === this.id); 
        const updatedProducts = [...products]; // replace old contents 
        // this ===> updated product 
        updatedProducts[existingProductIndex] = this; 
        // Store updated products 
        fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
          console.log(err);
        }); 
      } else {
        // Create a new product with a new id 
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), (err) => {
          console.log(err);
        });  
      }
    }); 
  }

  static deleteById(id) {
    getProductsFromFile(products => {
      const product = products.find(prod => prod.id === id); 
      // Get all products where id does not match ours 
      const updatedProducts = products.filter(prod => prod.id !== id);
      fs.writeFile(p, JSON.stringify(updatedProducts), err => {
        if (!err) {
          // remove from cart 
          Cart.deleteProduct(id, product.price); 
        }
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