const Product = require("../models/product"); 

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product', 
    editing: false
  });
};

exports.postAddProducts = (req, res, next) => {
  // getting data from response to data model 
  const title = req.body.title; 
  const imageUrl = req.body.imageUrl; 
  const price = req.body.price; 
  const description = req.body.description; 
  const product = new Product(null, title, imageUrl, description, price);
  product.save();
  res.redirect('/');
}; 

exports.getEditProduct = (req, res, next) => {
  // query params 
  const editMode = req.query.edit; 
  if (!editMode) {
    res.redirect('/'); 
  }
  const prodId = req.params.productId; 
  Product.findById(prodId, product => {
    if (!product) {
      return res.redirect('/'); 
    }
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product: product
    });
  }); 
};

exports.postEditProduct = (req, res, next) => {
  // Fetch information for the product from the form 
  const prodId = req.body.productId; 
  const updatedTitle = req.body.title; 
  const updatedPrice = req.body.price; 
  const updatedImageUrl = req.body.imageUrl; 
  const updatedDesc = req.body.description; 
  // Create a new instance with the information and call save 
  const updatedProduct = new Product(prodId, 
    updatedTitle, 
    updatedImageUrl,
    updatedDesc, 
    updatedPrice
    ); 
  updatedProduct.save();     
  res.redirect('/admin/products'); 
}; 

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products"
    });
  }); 
}

exports.postDeleteProduct = (req, res, next) => {
  // Getting Id from request 
  const prodId = req.body.productId; 
  Product.deleteById(prodId); 
  res.redirect('/admin/products'); 
}