const NightPrice = require("../models/night_price");
const { body, validationResult } = require("express-validator/check");
const { sanitizeBody } = require("express-validator/filter");
const async = require("async");
const { addDays } = require("date-fns");
const R = require("ramda");
const debug = require("debug")("wang:server");

exports.prices = function(req, res, next) {
  NightPrice.find().exec(function(err, prices) {
    if (err) {
      return next(err);
    }
    res.send(prices);
  });
};

exports.price_update_post = [
  body("price").isDecimal(),
  body("start").isISO8601(),
  body("end").isISO8601(),
  sanitizeBody("price")
    .trim()
    .escape()
    .toInt(),
  sanitizeBody("start")
    .trim()
    .escape()
    .toDate(),
  sanitizeBody("end")
    .trim()
    .escape()
    .toDate(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      debug(errors);
      next(errors.array());
    } else {
      // new start here to make sure we always insert date with the same hours
      const start = new Date(
        req.body.start.getFullYear(),
        req.body.start.getMonth(),
        req.body.start.getDate()
      );
      const dates = R.unfold(
        date => (date >= req.body.end ? false : [date, addDays(date, 1)]),
        start
      );
      debug(dates);
      async.eachSeries(
        dates,
        (date, cb) => {
          NightPrice.updateOne(
            { date: date },
            { date: date, price: req.body.price },
            { upsert: true },
            cb
          );
        },
        err => {
          if (err !== null) {
            debug(err);
            return next(err);
          }
        }
      );
      res.send({ updateSuccess: true });
    }
  }
];
