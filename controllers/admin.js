const Product = require("../models/product"); 
const { validationResult } = require("express-validator/check"); 
const mongoose = require('mongoose');
const fileHelper = require('../util/file'); 

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: []
  });
};


exports.postAddProducts = (req, res, next) => {
  // Get data from user input 
  const title = req.body.title; 
  const image = req.file;
  const price = req.body.price; 
  const description = req.body.description; 
  if (!image) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      product: {
        title: title,
        price: price,
        description: description
      },
      errorMessage: 'Attached file is not an image',
      validationErrors: []
    });
  }
  const errors = validationResult(req); 

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      product: {
        title: title, 
        price: price, 
        description: description
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  const imageUrl = image.path; 
  // Map data to our product scheme 
  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user
  });
  product
    .save()
    .then(result => {
      console.log("Created product successfully")
      res.redirect('/admin/products'); 
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500; 
      return next(error); 
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
        // Redirect to starting page if there are no products 
        return res.redirect('/'); 
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
        hasError: false,
        errorMessage: null,
        validationErrors: []
      });
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error); 
  });   
};


exports.postEditProduct = (req, res, next) => {
  // Fetch information for the product from the form 
  const prodId = req.body.productId; 
  const updatedTitle = req.body.title; 
  const updatedPrice = req.body.price; 
  const image = req.file;
  const updatedDesc = req.body.description; 
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: true,
      hasError: true,
      product: {
        title: updatedTitle,
        price: updatedPrice,
        description: updatedDesc,
        _id: prodId
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  Product.findById(prodId).then(product => {
    if (product.userId.toString() !== req.user._id.toString()) {
      return res.redirect("/");
    }
    product.title = updatedTitle; 
    product.price = updatedPrice; 
    product.description = updatedDesc; 
    if (image) {
      fileHelper.deleteFile(product.imageUrl); 
      product.imageUrl = image.path;
    }
    return product.save() // update object 
      .then(result => {
        console.log('Updated product!');
        res.redirect('/admin/products');
    })
  }) // redirect back when saving is done 
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error); 
  }); 
}; 


exports.getProducts = (req, res, next) => {
  // Restricting access for authorized users only 
  Product.find({userId: req.user._id})
    .then(products => {
      console.log(products);
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products"
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error); 
    }); 
}


exports.postDeleteProduct = (req, res, next) => {
  // Getting Id from request 
  const prodId = req.body.productId; 
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return next(new Error('Product not found')); 
      }
      fileHelper.deleteFile(product.imageUrl); 
      return Product.deleteOne({ _id: prodId, userId: req.user._id }); 
    })
    .then(() => {
      console.log("ITEM REMOVED FROM DATABASE");
      res.redirect('/admin/products');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    }); 
}