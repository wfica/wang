const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
  start: {
    type: Date,
    required: [true, "Start date required"]
  },
  end: {
    type: Date,
    required: [true, "End date required"]
  },
  price: {
    type: Schema.Types.Decimal128
  },
  guest: {
    type: Schema.Types.ObjectId,
    ref: "Guest",
    required: [true, "Guest ID is required"]
  }
});

module.exports = mongoose.model("Booking", BookingSchema);
