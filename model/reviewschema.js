const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let myReviews = new Schema({
  review: {
    type: String,
    required: [true, 'Review field is required']
  },
  title: {
    type: String,
    required: [true, 'Title field is required']
  },
}, {
  collection: 'myReviews'
})

module.exports = mongoose.model('myReviews', myReviews)

