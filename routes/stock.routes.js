const express = require('express');
const stockRoute = express();

// Stock model
let myStockData = require('../model/stockschema');

// Get all Stock
stockRoute.route('/').get((req, res) => {
    myStockData.find((error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
})

stockRoute.get('/by/:symbol', async (req, res) => {
    const allData = await myStockData.find({"symbol":req.params.symbol});
    try {
        res.send(allData);
    } catch (err) {
        res.status(500).send(err);
    }
})

module.exports = stockRoute;