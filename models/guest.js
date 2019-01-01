const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GuestSchema = new Schema({
  first_name: {
    type: String,
    required: [true, "Guest first name required"],
    maxLength: 100
  },
  family_name: {
    type: String,
    required: [true, "Guest family name required"],
    maxLength: 100
  },
  email: {
    type: String,
    validate: {
      validator: val => {
        const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        return emailRegex.test(val);
      },
      msg: "Guest email incorrect"
    },
    maxLength: 100
  },
  phone: {
    type: String,
    required: [true, "Guest phone number required"],
    maxLength: 100
  }
});

module.exports = mongoose.model("Guest", GuestSchema);
