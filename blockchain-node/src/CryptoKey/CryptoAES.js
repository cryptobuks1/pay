const CryptoJS = require('crypto-js');

const { PASSWORD_HASH_KEY: nearKey } = process.env;

const encryptAES = (text) => {
  const ciphertext = CryptoJS.AES.encrypt(text, nearKey);
  return ciphertext.toString();
};
   
const decryptAES = (text) => {
  let bytes  = CryptoJS.AES.decrypt(text, nearKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

const decryptAESCShape = (text) => {
  const encryptData = text;

  try {
    const iv = CryptoJS.enc.Hex.parse('e84ad660c4721ae0e84ad660c4721ae0');
    const Pass = CryptoJS.enc.Utf8.parse(nearKey);
    const Salt = CryptoJS.enc.Utf8.parse("insight123resultxyz");
    const key128Bits1000Iterations = CryptoJS.PBKDF2(Pass.toString(CryptoJS.enc.Utf8), Salt, { keySize: 128 / 32, iterations: 1000 });
    const cipherParams = CryptoJS.lib.CipherParams.create({
                    ciphertext: CryptoJS.enc.Base64.parse(encryptData)
                });

                //Decrypting the string contained in cipherParams using the PBKDF2 key
    const decrypted = CryptoJS.AES.decrypt(
      cipherParams, 
      key128Bits1000Iterations, 
      { 
        mode: CryptoJS.mode.CBC, 
        iv: iv, 
        padding: CryptoJS.pad.Pkcs7 
      });
    return decrypted.toString(CryptoJS.enc.Utf8);
    
  } catch (err) {
    //Malformed UTF Data due to incorrect password
   return "";
 }
};

module.exports = {
  encryptAES,
  decryptAES,
  decryptAESCShape
};