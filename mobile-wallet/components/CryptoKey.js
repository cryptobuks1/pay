//const crypto = require('crypto');
import CryptoJS from 'crypto-js';

const nearKey = 'require(crypto)';

function encryptKey(text){
  const ciphertext = CryptoJS.AES.encrypt(text, nearKey);
  // const cipher = crypto.createCipher('aes-256-cbc',nearKey); 
  // let encipheredContent = cipher.update(text,'utf8','hex'); 
  // encipheredContent += cipher.final('hex');
  // return encipheredContent;
  return ciphertext.toString();
};
   
function decryptKey(text){
//   const decipher = crypto.createDecipher('aes-256-cbc',nearKey);
//   let decipheredPlaintext = decipher.update(text,'hex','utf8');
//   decipheredPlaintext += decipher.final('utf8');
//   return decipheredPlaintext;
  let bytes  = CryptoJS.AES.decrypt(text, nearKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}

exports.encryptKey = encryptKey;
exports.decryptKey = decryptKey;