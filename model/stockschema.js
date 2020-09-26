const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let myStockData = new Schema({
  name: String,
  symbol: String,
  timeseries: [{date: Date, open: Number, close: Number, predicted: Number}],
  technical: {
    stddev: Number,
    sma: Number
  },
  news: {
    type: Array
  },
  facts: {
    type: Array
  }
}, {
  collection: 'myStockData'
})

module.exports = mongoose.model('myStockData', myStockData)

