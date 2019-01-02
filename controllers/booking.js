const Booking = require("../models/booking");
const Guest = require("../models/guest");
const DefaultPrice = require("../models/default_price");
const { body, validationResult } = require("express-validator/check");
const { sanitizeBody } = require("express-validator/filter");
const async = require("async");
const validator = require("validator");
const debug = require("debug")("wang:server");

// Handle Bookings list on GET
exports.bookings_list = function(req, res, next) {
  Booking.find()
    .sort({ start: -1 })
    .populate("guest")
    .exec(function(err, bookings_list) {
      if (err) {
        return next(err);
      }
      res.send(bookings_list);
    });
};

// a and b are javascript Date objects
bookingsOverlap = (a, b) => {
  if (a.start > b.start) return bookingsOverlap(b, a);
  return a.end > b.start;
};

// a and b are javascript Date objects
dateDiffInDays = (a, b) => {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
};

//Handle booking create on post
exports.booking_create_post = [
  body("start").isISO8601(),
  body("end").isISO8601(),
  body("price").isDecimal(),
  body("guest").custom(value => validator.isMongoId(value._id)),
  sanitizeBody("start")
    .trim()
    .escape()
    .toDate(),
  sanitizeBody("end")
    .trim()
    .escape()
    .toDate(),
  sanitizeBody("price")
    .trim()
    .escape(),
  sanitizeBody("guest")
    .trim()
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    debug(errors.array());
    if (!errors.isEmpty()) {
      next(errors.array());
    } else {
      async.parallel(
        {
          bookings: function(cb) {
            Booking.find().exec(cb);
          },
          default_price: function(cb) {
            DefaultPrice.find().exec(cb);
          },
          guest: function(cb) {
            Guest.findById(req.body.guest).exec(cb);
          }
        },
        (err, results) => {
          if (err) {
            return next(err);
          }
          if (!results.guest) {
            return next("no guest found");
          }
          debug(req.body.start);
          const price =
            results.default_price *
            dateDiffInDays(req.body.start, req.body.end);
          const newBooking = new Booking({
            start: req.body.start,
            end: req.body.end,
            price: price,
            guest: req.body.guest
          });
          const conflict = results.bookings.find(booking =>
            bookingsOverlap(booking, newBooking)
          );
          if (conflict) {
            return res.send({ conflict: conflict });
          }
          newBooking.save(err => {
            if (err) {
              return next(err);
            }
            res.send({ booking: newBooking });
          });
        }
      );
    }
  }
];
