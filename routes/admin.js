const express = require("express");
const adminController = require('../controllers/admin'); 
const router = express.Router(); 
const isAuth = require('../middleware/is-auth'); // used to guard our routes 



router.get('/add-product', isAuth, adminController.getAddProduct);
router.get("/products", isAuth, adminController.getProducts);
router.post('/add-product', isAuth, adminController.postAddProducts);  
router.get('/edit-product/:productId',isAuth, adminController.getEditProduct); 
router.post('/edit-product', isAuth, adminController.postEditProduct); 
router.post('/delete-product', isAuth, adminController.postDeleteProduct); 
module.exports = router; 

