var express = require("express");
var router = express.Router();

// Require controller modules.
var guest_controller = require("../controllers/guest");

/// GUEST ROUTES ///

// GET request for list of all Guests.
router.get("/guests", guest_controller.guests_list);

// POST request for creating guest
router.post("/guest/create", guest_controller.guest_create_post);

// POST request for deleting guest
router.post("/guest/:id/delete", guest_controller.guest_delete_post);

module.exports = router;
