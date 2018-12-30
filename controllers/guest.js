const Guest = require("../models/guest");
const { body, validationResult } = require("express-validator/check");
const { sanitizeBody } = require("express-validator/filter");
var debug = require("debug")("wang:server");

// Handle Guests list on GET.
exports.guests_list = function(req, res, err) {
  debug("get guest list");
  Guest.find()
    .sort([["family_name", "ascending"]])
    .exec(function(err, guests_list) {
      if (err) {
        return next(err);
      }
      res.send(guests_list);
    });
};

// Handle Guest create on POST.
exports.guest_create_post = [
  // Validate fields.
  body("first_name")
    .isLength({ min: 1 })
    .isLength({ max: 100 })
    .trim()
    .withMessage("First name must be specified.")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),
  body("family_name")
    .isLength({ max: 100 })
    .isLength({ min: 1 })
    .trim()
    .withMessage("Family name must be specified.")
    .isAlphanumeric()
    .withMessage("Family name has non-alphanumeric characters."),
  body("email")
    .isEmail()
    .isLength({ max: 100 })
    .isLength({ min: 1 })
    .trim(),

  // Sanitize fields.
  sanitizeBody("first_name")
    .trim()
    .escape(),
  sanitizeBody("family_name")
    .trim()
    .escape(),
  sanitizeBody("email")
    .trim()
    .escape(),
  sanitizeBody("phone")
    .trim()
    .escape(),

  // Process request after validation and sanitization.
  (req, res) => {
    debug("post create guest");
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.send({ errors: errors.array() });
      return;
    } else {
      // Data from form is valid.
      // Create a Guest object with escaped and trimmed data.
      var guest = new Guest({
        first_name: req.body.first_name,
        family_name: req.body.family_name,
        email: req.body.email,
        phone: req.body.phone
      });
      guest.save(function(err) {
        if (err) {
          return res.send({ errors: err });
        }
        // Successful - send new  guest record.
        // res.redirect("/catalog/calendar");
        res.send({ guest: guest });
      });
    }
  }
];
