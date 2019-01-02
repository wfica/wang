const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DefaultPriceSchema = new Schema({
  price: {
    type: Schema.Types.Decimal128,
    required: true
  }
});

module.exports = mongoose.model("DefaultPrice", DefaultPriceSchema);
