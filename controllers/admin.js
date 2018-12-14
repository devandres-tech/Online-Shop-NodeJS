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
  const product = new Product(title, imageUrl, description, price, null, req.user._id);
  product
    .save()
    .then(result => {
      res.redirect('/admin/products'); 
    })
    .catch(err => {
      console.log('err'); 
    });
}; 

exports.getEditProduct = (req, res, next) => {
  // query params 
  const editMode = req.query.edit; 
  if (!editMode) {
    res.redirect('/'); 
  }
  const prodId = req.params.productId; 
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/'); 
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product
      });
  })
  .catch(err => console.log(err));  
};

exports.postEditProduct = (req, res, next) => {
  // Fetch information for the product from the form 
  const prodId = req.body.productId; 
  const updatedTitle = req.body.title; 
  const updatedPrice = req.body.price; 
  const updatedImageUrl = req.body.imageUrl; 
  const updatedDesc = req.body.description; 
  // Create a new instance with the information and call save 
  const product = new Product(
    updatedTitle,
    updatedImageUrl, 
    updatedDesc, 
    updatedPrice,
    prodId
  ); 

  product
  .save()
  .then(result => {
      console.log('Updated product!'); 
      res.redirect('/admin/products'); 
    })
    .catch(err => console.log(err)); 
}; 

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products"
      });
    })
    .catch(err => console.log(err)); 
}

exports.postDeleteProduct = (req, res, next) => {
  // Getting Id from request 
  const prodId = req.body.productId; 
  Product.deleteById(prodId)
    .then(() => {
      console.log("ITEM REMOVED FROM DATABASE"); 
      res.redirect('/admin/products'); 
    })
    .catch(err => {
      console.log(err); 
    })
}