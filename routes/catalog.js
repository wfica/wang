const express = require("express");
const router = express.Router();

// Require controller modules.
const guest_controller = require("../controllers/guest");
const booking_controller = require("../controllers/booking");
const night_price_controller= require("../controllers/night_price");

/// GUEST ROUTES ///

// GET request for list of all Guests.
router.get("/guests", guest_controller.guests_list);

// POST request for creating guest
router.post("/guest/create", guest_controller.guest_create_post);

// POST request for deleting guest
router.post("/guest/:id/delete", guest_controller.guest_delete_post);

// POST request for deleting guest
router.post("/guest/:id/update", guest_controller.guest_update_post);

/// BOOKING ROUTES ///

// GET request for all bookings
router.get("/bookings", booking_controller.bookings_list);

// POST request for creating a booking
router.post("/booking/create", booking_controller.booking_create_post);


/// NIGHT PRICE ROUTES ///

// GET request for all custom prices
router.get("/prices", night_price_controller.prices);

// POST request for creating a booking
router.post("/price/update", night_price_controller.price_update_post);


module.exports = router;
