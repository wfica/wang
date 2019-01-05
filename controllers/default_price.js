const DefaultPrice = require("../models/default_price");
const debug = require("debug")("wang:server");

exports.price = function(req, res, next) {
  DefaultPrice.find().exec(function(err, prices) {
    if (err) {
      return next(err);
    }
    debug("default price", prices[0]);
    res.send(prices[0]);
  });
};
