const CryptoJS = require("crypto-js"),
  _ = require("lodash");

const {bitcore} =  require("./CryptoKey");

const {
  getSignature,
  verifySignature
} = bitcore;

// Where are the coins going?
class TxOut {
  constructor(address, amount, sym) {
    this.address = address;
    this.amount = amount;
    this.sym = sym;
  }
}

// Where do the coins come from?
class TxIn {
  // txOutId (=Earlier Output)
  // txOutIndex
  // signature
}
// A transaction is made up of Transaction Input (txIns) and Transaction Outputs (txOuts)
class Transaction {
  // ID
  // txIns []
  // txOuts []
  constructor() {
    this.timestamp = new Date().getTime();
  }
}

// Unspent Transaction Output
class UnspentTxOut {
  constructor(txOutId, txOutIndex, address, amount, sym) {
    this.txOutId = txOutId;
    this.txOutIndex = txOutIndex;
    this.address = address;
    this.amount = amount;
    this.sym = sym;
  }
}

// Create the Transaction ID
const getTxId = tx => {
  // Add up all the content of the transactions Ins
  const txInContent = tx.txIns
    .map(txIn => txIn.txOutId + txIn.txOutIndex)
    .reduce((a, b) => a + b, "");
  // Add up all the content of the transactions Out
  const txOutContent = tx.txOuts
    .map(txOut => txOut.sym + txOut.address + txOut.amount)
    .reduce((a, b) => a + b, "");

  // Return the hash
  return CryptoJS.SHA256(txInContent + txOutContent + tx.timestamp).toString();
};

// Sign the transaction input
const signTxIn = (tx, txInIndex, privateKeyWif, unspentTxOuts, publicAddress) => {
  const txIn = tx.txIns[txInIndex];
  const dataToSign = tx.id;
  const referencedUnspentTxOut = findUnspentTxOut(
    txIn.txOutId,
    txIn.txOutIndex,
    unspentTxOuts
  );
  if (referencedUnspentTxOut === null) {
    // Before we sign anything it's cool to check if this txIn comes from an uTxOut
    return;
  }
  const referencedAddress = referencedUnspentTxOut.address;
  if (publicAddress.toString() !== referencedAddress) {
    return false;
  }
  const signature = getSignature(privateKeyWif, dataToSign);
  return signature;
};

// Find the unspent amount that we are looking for
const findUnspentTxOut = (txId, txIndex, unspentTxOuts) => {
  return unspentTxOuts.find(
    // Unspent Transaction Output
    uTxO => uTxO.txOutId === txId && uTxO.txOutIndex === txIndex
  );
};

// Update the transaction outputs
const updateUnspentTxOuts = (newTxs, uTxOuts) => {
  // We need to get all the new TxOuts from a transaction
  const newUTxOuts = newTxs
    .map(tx => {
      return tx.txOuts.map(
        (txOut, index) =>
          new UnspentTxOut(tx.id, index, txOut.address, txOut.amount, txOut.sym)
      );
    })
    .reduce((a, b) => a.concat(b), []);
  // We also need to find all the TxOuts that were used as TxIns and Empty them
  const spentTxOuts = newTxs
    .map(tx => tx.txIns)
    .reduce((a, b) => a.concat(b), [])
    .map(txIn => new UnspentTxOut(txIn.txOutId, txIn.txOutIndex, "", 0, ""));

  const resultingUTxOuts = uTxOuts
    .filter(
      uTxO => !findUnspentTxOut(uTxO.txOutId, uTxO.txOutIndex, spentTxOuts)
    )
    .concat(newUTxOuts);

  return resultingUTxOuts;
};

const isAddressValid = address => {
  return true;
};

const isTxInStructureValid = txIn => {
  if (txIn == null) {
    return false;
  } else if (typeof txIn.signature !== "string") {
    return false;
  } else if (typeof txIn.txOutId !== "string") {
    return false;
  } else if (typeof txIn.txOutIndex !== "number") {
    return false;
  } else {
    return true;
  }
};

const isTxOutStructureValid = txOut => {
  if (txOut == null) {
    // Check if the TxOut is null
    return false;
  } else if (typeof txOut.address !== "string") {
    // Check if the address of the txOut is not a string
    return false;
  } else if (!isAddressValid(txOut.address)) {
    // Check if the structure of the address is not valid
    return false;
  } else if (typeof txOut.amount !== "number") {
    // Check if the amount is not a number
    return false;
  } else if (typeof txOut.sym !== "string") {
    // Check if the amount is not a number
    return false;
  } else {
    return true;
  }
};

// Just validating the Tx's structure just like we validate blocks
const isTxStructureValid = tx => {
  if (typeof tx.id !== "string") {
    console.log(" Check if the ID is not a string");
    return false;
  } else if (!(tx.txIns instanceof Array)) {
    console.log(" Check if the txIns are not an array");
    return false;
  } else if (
    !tx.txIns.map(isTxInStructureValid).reduce((a, b) => a && b, true)
  ) {
    console.log(" This one is actually pretty cool.");
    return false;
  } else if (!(tx.txOuts instanceof Array)) {
    console.log(" Check if the txOuts are not an array");
    return false;
  } else if (
    !tx.txOuts.map(isTxOutStructureValid).reduce((a, b) => a && b, true)
  ) {
    console.log(" We do the same as before");
    return false;
  } else {
    return true;
  }
};

// We need to find the txIn and validate it
const validateTxIn = (txIn, tx, uTxOuts) => {
  if(uTxOuts.length === 0 || txIn.signature.length === 0) return true;

  // So we start by finding a uTxO that is the input of a transaction
  const wantedTxOut = uTxOuts.find(uTxO => 
    uTxO.txOutId === txIn.txOutId && uTxO.txOutIndex === txIn.txOutIndex
  );
  if (wantedTxOut === null || wantedTxOut === undefined) {
    return false;
  } else {
    // Get the address of the foudn uTxOut
    const address = wantedTxOut.address;
    // With the address(public key) we can verify the signature of the txIn
    return verifySignature(address, txIn.signature, tx.id);// key.verify(tx.id, txIn.signature);
  }
};

// We will need to be able to get the TxIn Amount
const getAmountInTxIn = (txIn, uTxOuts) =>
  findUnspentTxOut(txIn.txOutId, txIn.txOutIndex, uTxOuts).amount;

const validateTx = (tx, uTxOuts) => {
  if (!isTxStructureValid(tx)) {
    return null;
  } else if (getTxId(tx) !== tx.id) {
    //console.log("validateTx, getTxId(tx) !== tx.id");
    return false;
  }
  // We also check if the TxIns are valid
  // by appliying the function and then reducing to a true value
  const hasValidTxIns = tx.txIns
    .map(txIn => validateTxIn(txIn, tx, uTxOuts))
    .reduce((a, b) => a && b, true);

  if (!hasValidTxIns) {
    //console.log("validateTx, !hasValidTxIns");
    return false;
  }

  if(uTxOuts.length === 0) return true;
  if(tx.txIns[0].txOutId.length === 0) return true;
  // First we get the amount in the TxIns
  const amountInTxIns = tx.txIns
    .map(txIn => getAmountInTxIn(txIn, uTxOuts))
    .reduce((a, b) => a + b, 0);

  // Then we get the amount in the TxOuts
  const amountInTxOuts = tx.txOuts
    .map(txOut => txOut.amount)
    .reduce((a, b) => a + b, 0);

  // And finally we check if they have the same amount (they should)
  if (amountInTxIns !== amountInTxOuts) {
    //console.log("validateTx, amountInTxIns !== amountInTxOuts");
    return false;
  }

  return true;
};

// Checkin if there are any duplicated
const hasDuplicates = txIns => {
  const groups = _.countBy(txIns, txIn => txIn.txOutId + txIn.txOutIndex);
  // Then we map all the groups and we check if they have more than one
  return _(groups)
    .map(value => {
      if (value > 1) {
        // Found a duplicate
        return true;
      } else {
        return false;
      }
    })
    .includes(true);
};

const validateBlockTransactions = (tx, uTxOuts, blockIndex) => {
  // Getting all the txIns
  const txIns = _(tx)
    .map(tx => tx.txIns)
    .flatten()
    .value();

  if (hasDuplicates(txIns)) {
    console.log("Found duplicated txIns");
    return false;
  }

  // We split the Transactions in two so we don't include the coinbase tx
  const nonCoinbaseTx = tx.slice(1);
  return nonCoinbaseTx
    .map(tx => validateTx(tx, uTxOuts))
    .reduce((a, b) => a && b, true);
};

// Process the transactions, this means validate them and then return the updated uTxOuts
const processTransactions = (txs, uTxOuts, blockIndex) => {
  // First we validate the structure of the Tx
  if (!validateBlockTransactions(txs, uTxOuts, blockIndex)) {
    console.log('We also validate the block transactions');
    return null;
  }
  return updateUnspentTxOuts(txs, uTxOuts);
};

module.exports = {
  TxOut,
  TxIn,
  Transaction,
  getTxId,
  signTxIn,
  isAddressValid,
  processTransactions,
  validateTx
};
