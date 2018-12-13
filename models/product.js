
const getDb = require('../util/database').getDb; 
const mongodb = require('mongodb'); 

class Product {
  constructor(title, imageUrl, description, price, id) {
    this.title = title; 
    this.price = price; 
    this.description = description; 
    this.imageUrl = imageUrl; 
    this._id = id; 
  }

  save() {
    const db = getDb();
    let dbOperation; 
    if (this._id) {
      // Update product if already in database 
      dbOperation = db.collection('products')
        .updateOne({_id: new mongodb.ObjectId(this._id)}, {$set: this}); 
    } else {
      // else create new one if not in database 
      dbOperation = db.collection('products').insertOne(this); 
    }
    return dbOperation
      .then(result => {
        console.log(result); 
      })
      .catch(err => {
        console.log(err); 
      })
  }

  static fetchAll() {
    const db = getDb();
    return db.collection('products').
      find()
      .toArray()
      .then(products => {
        console.log(products); 
        return products; 
      })
      .catch(err => {
        console.log(err); 
      }); 
  }

  static findById(prodId) {
    const db = getDb(); 
    return db.collection('products')
      .find({_id: new mongodb.ObjectId(prodId)})
      .next()
      .then(product => {
        console.log(product); 
        return product; 
      })
      .catch(err => {
        console.log(err); 
      })
  }
}

module.exports = Product; 