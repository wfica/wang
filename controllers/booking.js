const Booking = require("../models/booking");
const Guest = require("../models/guest");
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
    .escape()
    .toInt(),
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
          const newBooking = new Booking({
            start: req.body.start,
            end: req.body.end,
            price: req.body.price,
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
            newBooking.guest = results.guest;
            res.send({ booking: newBooking });
          });
        }
      );
    }
  }
];
