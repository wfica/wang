const express = require("express");
const router = express.Router();

// Require controller modules.
const guest_controller = require("../controllers/guest");
const booking_controller = require("../controllers/booking");

/// GUEST ROUTES ///

// GET request for list of all Guests.
router.get("/guests", guest_controller.guests_list);

// POST request for creating guest
router.post("/guest/create", guest_controller.guest_create_post);

// POST request for deleting guest
router.post("/guest/:id/delete", guest_controller.guest_delete_post);

// POST request for deleting guest
router.post("/guest/:id/update", guest_controller.guest_update_post);

// GET request for all bookings
router.get("/bookings", booking_controller.bookings_list);

// POST request for creating a booking
router.post("/booking/create", booking_controller.booking_create_post);

module.exports = router;
