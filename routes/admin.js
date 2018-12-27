const express = require("express");
const adminController = require('../controllers/admin'); 
const router = express.Router(); 
const isAuth = require('../middleware/is-auth'); // used to guard our routes 
const { body } = require('express-validator/check'); 


router.get('/add-product', isAuth, adminController.getAddProduct);

router.get("/products", isAuth, adminController.getProducts);

router.post('/add-product', [
  body('title')
    .isString()
    .isLength({ min: 3 })
    .trim(),
  body('price')
    .isFloat(),
  body('description')
    .isLength({ min: 3, max: 400 })
    .trim(),
],
isAuth, adminController.postAddProducts);  

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct); 

router.post('/edit-product',[
  body('title')
    .isString()
    .isLength({ min: 3 })
    .trim(),
  body('price')
    .isFloat(),
  body('description')
    .isLength({ min: 3, max: 400 })
    .trim(),
], isAuth, adminController.postEditProduct); 

router.post('/delete-product', isAuth, adminController.postDeleteProduct); 

module.exports = router; 

