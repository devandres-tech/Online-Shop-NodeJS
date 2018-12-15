const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

// Define how our product schema should look like 
const productSchema = new Schema({
  title: {
    type: String, 
    required: true
  },
  price: {
    type: Number, 
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String, 
    required: true
  }, // Relate to the user model 
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}); 

module.exports = mongoose.model('Product', productSchema); 


// // Data base connection 
// const getDb = require('../util/database').getDb; 
// const mongodb = require('mongodb'); 

// class Product {
//   constructor(title, imageUrl, description, price, id, userId) {
//     this.title = title; 
//     this.price = price; 
//     this.description = description; 
//     this.imageUrl = imageUrl; 
//     this._id = id ? new mongodb.ObjectId(id) : null; 
//     this.userId = userId; 
//   }

//   save() {
//     const db = getDb();
//     let dbOperation; 
//     if (this._id) {
//       // Update product if already in database 
//       dbOperation = db.collection('products')
//         .updateOne({_id: this._id}, {$set: this}); 
//     } else {
//       // else create new one if not in database 
//       dbOperation = db.collection('products').insertOne(this); 
//     }
//     return dbOperation
//       .then(result => {
//         console.log(result); 
//       })
//       .catch(err => {
//         console.log(err); 
//       })
//   }

//   static fetchAll() {
//     const db = getDb();
//     return db.collection('products').
//       find()
//       .toArray()
//       .then(products => {
//         console.log(products); 
//         return products; 
//       })
//       .catch(err => {
//         console.log(err); 
//       }); 
//   }

//   static findById(prodId) {
//     const db = getDb(); 
//     return db.collection('products')
//       .find({_id: new mongodb.ObjectId(prodId)})
//       .next()
//       .then(product => {
//         console.log(product); 
//         return product; 
//       })
//       .catch(err => {
//         console.log(err); 
//       })
//   }

//   static deleteById(prodId) {
//     const db = getDb(); 
//     return db.collection('products').deleteOne({ _id: new mongodb.ObjectId(prodId) })
//       .then(result => {
//         console.log('Item deleted!'); 
//       })
//       .catch(err => {
//         console.log(err); 
//       }); 
//   }
// } // End Product class 

// module.exports = Product; 