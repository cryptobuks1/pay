const mongoose = require('mongoose');
require('mongoose-double')(mongoose);
const { Schema } = mongoose;

const crypto = require('crypto');

const { PASSWORD_HASH_KEY: secret,
  MAIN_SYM: SYM } = process.env;

const { bitcore, CryptoAES } = require('lib/CryptoKey');
const { generatePrivateWIF, getAddressFromWif } = bitcore;
const { encryptAES, decryptAES } = CryptoAES;

function hash(pw) {
  return crypto.createHmac('sha256', secret).update(pw).digest('hex');
}

const Account = new Schema({
  email: String,
  pw: String,

  nick: String,
  level: String,

  wif: String,
  address: String,

  status: String,
  msgCnt: Schema.Types.Number,

  cToken: [String],

  tSym: [String],
  tAmount: [Schema.Types.Double],

  signupDate: {
    type: Date,
    default: Date.now
  }
});

Account.statics.register = async function({
  email, pw, nick, level}) {

  const wif = generatePrivateWIF();
  const address = getAddressFromWif(wif);

  const account = new this({
    email,
    pw: hash(pw),
    nick,
    level,
    wif: encryptAES(wif),
    address: address,
    status: 'active',
    msgCnt: 0,
    cToken: [],
    tSym: [SYM],
    tAmount: [0]
  });
  return account.save();
};

Account.methods.validatePassword = function(pw) {
  const hashed = hash(pw);
  return this.pw === hashed;
};
Account.methods.GetPasswordHash = function(pw) {
  return hash(pw);
};

Account.methods.GetAmounts = function() {
  const amounts = this.tSym.map((sym, i) => {
    return ({
      sym,
      amount: this.tAmount[i]
    });
  });
  return amounts;
};

Account.methods.GetSecurityKey = function() {
  return encryptAES(JSON.stringify({
    _id: this._id,
    pw: this.pw
  }));
};
Account.methods.validateKey = function(key) {
  const token = JSON.parse(decryptAES(key));
  return (token._id === this._id.toString() && 
    token.pw === this.pw);
};

module.exports = mongoose.model('accounts', Account);
