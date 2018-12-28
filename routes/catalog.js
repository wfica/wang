var express = require("express");
var router = express.Router();

// Require controller modules.
var guest_controller = require("../controllers/guest");

/// GUEST ROUTES ///

// GET request for list of all Guests.
router.get("/guests", guest_controller.guests_list);

router.get("/test", function(req, res) {
  res.send("to jest test");
});

module.exports = router;
