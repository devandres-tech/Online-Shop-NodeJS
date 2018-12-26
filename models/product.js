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
