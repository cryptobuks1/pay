const bitcore = require('zcash-bitcore-lib');
const Message = require('zcash-bitcore-message');
const CryptoJS = require('crypto-js');

const generatePrivateWIF = () => {
  const privateKey = new bitcore.PrivateKey();
  const wif = privateKey.toWIF();
  return wif;
};
  
const getAddressFromWif = (wif) => {
  const address = new bitcore.PrivateKey(wif).toAddress();
  return address;
};
    
const getSignature = (wif, msg) => {
  let privateKey = bitcore.PrivateKey.fromWIF(wif);
  const signature = Message(msg).sign(privateKey);
  return signature;
};
  
const verifySignature = (address, signature, msg) => {
  const verified = Message(msg).verify(address, signature);
  return verified;
};

const getSHA224 = msg => {
  return CryptoJS.SHA224(msg).toString();
};
const getSHA256 = msg => {
  return CryptoJS.SHA256(msg).toString();
};
  
module.exports = {
  generatePrivateWIF,
  getAddressFromWif,
  getSignature,
  verifySignature,
  getSHA224,
  getSHA256
};