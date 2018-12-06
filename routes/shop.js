const path = require("path");

const express = require("express");

const rootDir = require("../util/path");
const adminData = require("./admin");

const router = express.Router();

router.get('/', (req, res, next) => { // This route always runs 
  const products = adminData.products; 
  res.render('shop', {
    prods: products, 
    pageTitle: 'Shop', 
    path: '/',
    activeShop: true,  
    productCss: true,
    hasProducts: products.length > 0}); // will look for pug files
}); 

module.exports = router; 