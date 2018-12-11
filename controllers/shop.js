const Product = require('../models/product'); 
const Cart = require('../models/cart'); 

/** Render our views */
exports.getProducts = (req, res, next) => { 
  // pas an anonymous function as an argument 
  Product.fetchAll((products) => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    }); 
  }); 
}; 

exports.getProduct = (req, res, next) => {
  // getting the id from the Url 
  const prodId = req.params.productId;
  // Finding our product in our database 
  Product.findById(prodId, product => {
    res.render('shop/product-detail', {
      product: product,
      pageTitle: "Product Details",
      path: "/products"
    }); 
  }); 
}

exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  }); 
}; 

exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = []; 
      for (product of products) {
        const cartProductData = cart.products.find(prod => prod.id === product.id); 
        // Check if product is stored in cart 
        if (cart.products.find(prod => prod.id === product.id)) {
          cartProducts.push({productData: product, qty: cartProductData.qty}); 
        }
      }
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts
      }); 
    }); 
  })
}; 

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId; 
  Product.findById(prodId, (product) => {
    Cart.addProduct(prodId, product.price); 
  }); 
  res.redirect('/cart'); 
}; 

exports.deleteCart = (req, res, next) => {
  // Get id from post request (views)
  const prodId = req.body.productId; 
  // Get product price before deleting from cart 
  Product.findById(prodId, product => {
    Cart.deleteProduct(prodId, product.price); 
    // Redirect back to cart after deleting 
    res.redirect('/cart'); 
  }); 
  
}; 

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders', 
    pageTitle: 'Your Orders'
  })
}; 

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout', 
    pageTitle: 'checkout'
  })
}; 

  