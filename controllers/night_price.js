const NightPrice = require("../models/night_price");
const { body, validationResult } = require("express-validator/check");
const { sanitizeBody } = require("express-validator/filter");
const async = require("async");
const { addDays } = require("date-fns");
const R = require("ramda");

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
      next(errors.array());
    } else {
      const dates = R.unfold(
        date => (date >= req.body.end ? false : [date, addDays(date, 1)]),
        req.body.start
      );
      async.eachSeries(
        dates,
        (date, cb) => {
          NightPrice.update(
            { date: date },
            { date: date, price: req.body.price },
            { upsert: true },
            cb
          );
        },
        err => {
          return next(err);
        }
      );
      res.send({ updateSuccess: true });
    }
  }
];
