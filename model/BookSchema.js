const mongoose = require('mongoose');
const { v4: uuidv4} = require('uuid');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  rating: {
    type: Number,
    enum: [1,2,3,4,5],
    required: true
  },
  active: {
    type: Boolean,
    default: true,
  }, 
  yearOfPublished: {
    type: Number,
    required: true
  },
  uuid: {
    type: String,
    unique: true,
    default: uuidv4
  }

});

module.exports = mongoose.model('Book', bookSchema);