const mongoose = require('mongoose');
const { Schema } = mongoose;

const ChainBlock = new Schema({
  index: Schema.Types.Number,
  page: Schema.Types.Number,
  hash: String,
  data: String
});

ChainBlock.statics.register = function({
  index, hash, data}) {

  const chainBlock = new this({
    index,
    page: Math.floor(index / 100),
    hash,
    data
  });
  return chainBlock.save();
};

module.exports = mongoose.model('chainblocks', ChainBlock);
