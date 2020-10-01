const express = require('express');
const stockRoute = express();

// Stock model
let myStockData = require('../model/stockschema');

// Get all Stock
stockRoute.route('/').get(async (req, res) => {
    myStockData.find((error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
})

stockRoute.get('/by/:symbol', async (req, res) => {
    const allData = await myStockData.find({ "symbol": req.params.symbol });
    try {
        res.send(allData);
    } catch (err) {
        res.status(500).send(err);
    }
})

stockRoute.get('/chartDataby/:symbol', async (req, res) => {
    const allData = await myStockData.find({ "symbol": req.params.symbol });
    try {
        newData = JSON.stringify(allData, ['timeseries', 'date', 'predicted', 'close']);
        newData = JSON.parse(newData);
        newData = newData[0].timeseries;

        // let dates = [];
        // let closeValues = [];

        // newData.map((item) => {
        //     dates.push(item.date);
        //     closeValues.push(item.close);
        //   });

        var predictedObj = [{
            name: "Predicted",
            series: []
        }];

        newData.map(function (item) {
            predictedObj[0].series.push({
                "name": item.date.slice(0, 10),
                "value": item.predicted
            });
        });

        var closeObj = [{
            name: "Actual",
            series: []
        }];

        newData.map(function (item) {
            closeObj[0].series.push({
                "name": item.date.slice(0, 10),
                "value": item.close
            });
        });

        var response = predictedObj.concat(closeObj);
        res.send(response);
    } catch (err) {
        res.status(500).send(err);
    }
})

module.exports = stockRoute;