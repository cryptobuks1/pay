const mongoose = require('mongoose');
require('mongoose-double')(mongoose);
const { Schema } = mongoose;

const Currency = new Schema({
  name: String,
  sym: String,
  volume: Schema.Types.Double,

  creatorEmail: String,
  creatorAddress: String,

  signupDate: {
    type: Date,
    default: Date.now
  }
});

Currency.statics.register = async function({
  name, sym, volume, email, address}) {

  const account = new this({
    name,
    sym,
    volume,
    creatorEmail: email,
    creatorAddress: address
  });
  return account.save();
};

module.exports = mongoose.model('currencys', Currency);
