const express = require('express');
const stockRoute = express();

// Stock model
let myStockData = require('../model/stockschema');
let myReviews = require('../model/reviewschema');


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

//Update timeseries
stockRoute.route('/').put(async (req, res) => {
    myStockData.findOneAndUpdate(
        {"symbol" : req.body.symbol},
        {
            $set: {
                timeseries: [{
                    date: req.body.date,
                    open: req.body.open,
                    close: req.body.close,
                    predicted: req.body.predicted,
                }]
            }
        },
        { new: true },
        function (err, data) {
            if (err) {
                return res.status(500).send({
                    message: err.message || "Some error occured while updating data"
                });
            }
            if (!data) {
                return res.status(404).send({
                    message: "data not found"
                });
            }

            return res.status(200).send(data);
        }
    );
})
//Get all Reviews
stockRoute.route('/reviews').get(async (req, res) => {
    myReviews.find((error, data) => {
        if (error) {
            return next(error);
        } else {
            res.json(data)
        }
    })
})

//Create a review
stockRoute.route('/reviews').post(function (req, res, next) {
    myReviews.create(req.body).then(function (data) {
        res.status(200).send(data);
    }).catch(next);
});

//Delete a review
stockRoute.delete('/reviews/:id', function (req, res, next) {
    myReviews.findByIdAndRemove({ _id: req.params.id }).then(function (data) {
        res.send(data);
    }).catch(next);
});

//Get stock document by symbol
stockRoute.get('/by/:symbol', async (req, res) => {
    const allData = await myStockData.find({ "symbol": req.params.symbol });
    try {
        res.send(allData);
    } catch (err) {
        res.status(500).send(err);
    }
})

// stockRoute.get('/by/:symbol/:date', async (req, res) => {
//     const allData = await myStockData.find({ "symbol": req.params.symbol, "timeseries.date": req.params.date });
//     try {
//         res.send(allData[0].timeseries);
//     } catch (err) {
//         res.status(500).send(err);
//     }
// })

//Get data in ngxchart schema
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