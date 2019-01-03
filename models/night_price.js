const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NightPriceSchema = new Schema({
  price: {
    type: Schema.Types.Decimal128,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model("NightPrice", NightPriceSchema);
