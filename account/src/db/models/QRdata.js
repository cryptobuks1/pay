const mongoose = require('mongoose');
const { Schema } = mongoose;

const QRdata = new Schema({
  email: String,
  address: String,
  sym: String,
  amount: String,
  memo: String
});

QRdata.statics.register = function({
  email, address, sym, amount, memo}) {

  const qrdata = new this({
    email,
    address,
    sym,
    amount,
    memo
  });
  return qrdata.save();
};

module.exports = mongoose.model('qrdatas', QRdata);
