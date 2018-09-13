import CryptoJS from 'crypto-js';

const nearKey = 'require(crypto)';

function encryptKey(text){
  const ciphertext = CryptoJS.AES.encrypt(text, nearKey);
  return ciphertext.toString();
};
   
function decryptKey(text){
  let bytes  = CryptoJS.AES.decrypt(text, nearKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}

exports.encryptKey = encryptKey;
exports.decryptKey = decryptKey;