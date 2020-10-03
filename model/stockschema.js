const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let myStockData = new Schema({
  name: String,
  symbol: String,
  logo: String,
  timeseries: [{date: String, open: Number, close: Number, predicted: Number}],
  technical: {
    stddev: Number,
    sma: Number,
    pavg: Number,
    ret: Number
  },
  news: [{headline: String, content: String}],
  facts: {
    type: Array
  }
}, {
  collection: 'myStockData'
})

module.exports = mongoose.model('myStockData', myStockData)

