const fs = require('fs'); 
const path = require('path'); 

const p = path.join(
  path.dirname(process.mainModule.filename), 
  'data', // Folder 
  'cart.json' // Filename 
)

/** Cart Model */
module.exports = class Cart {

  static addProduct(id, productPrice) {
    // Fetch the previous cart 
    fs.readFile(p, (err, fileContent) => {
      // Cart model --> array of products and quantity, total price 
      let cart = {products: [], totalPrice: 0}; 
      if (!err) {
        cart = JSON.parse(fileContent); 
      }
      // Analyze the cart => Find existing product 
      const existingProductIndex = cart.products.findIndex(prod => prod.id === id); 
      const existingProduct = cart.products[existingProductIndex]; 
      let updatedProduct; 
      // Add new product/ increase quantity 
      if (existingProduct) {
        // Replace existing product 
        updatedProduct = {...existingProduct}; 
        // add new property 
        updatedProduct.qty = updatedProduct.qty + 1; 
        cart.products = [...cart.products]; 
        cart.products[existingProductIndex] = updatedProduct; 
      } else {
        // Added to the cart products 
        updatedProduct = {id: id, qty: 1}; 
        cart.products = [...cart.products, updatedProduct]; 
      }
      // Update price 
      cart.totalPrice = cart.totalPrice + +productPrice; 
      fs.writeFile(p, JSON.stringify(cart), err => {
        console.log(err); 
      })
    }); 
  }; // End addProduct function 

  static deleteProduct(id, price) {
    // Get  cart 
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return; 
      }
      const updatedCart = {...JSON.parse(fileContent)}; 
      const product = updatedCart.products.find(prod => prod.id === id); 
      // Check if we really have the product 
      if (!product) {
        return; // Don't edit if is not part of the cart 
      }
      const productQty = product.qty; 
      updatedCart.products = updatedCart.products.filter(prod => prod.id !== id); 
      updatedCart.totalPrice = updatedCart.totalPrice - price * productQty; 

      fs.writeFile(p, JSON.stringify(updatedCart), err => {
        console.log(err);
      })
    }); 
  }

  // Get all products from cart 
  static getCart(cb) {
    fs.readFile(p, (err, fileContent) => {
      const cart = JSON.parse(fileContent); 
      if (err) {
        cb(null); 
      } else {
        cb(cart); // Return entire cart 
      }
    }); 
  }

}