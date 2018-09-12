const fs = require("fs"),
  _ = require("lodash"),
  path = require("path"),
  Transactions = require("./transactions");

const {bitcore} =  require("./CryptoKey");

const privateKeyLocation = path.join(__dirname, "./asrlint");

const {
  generatePrivateWIF,
  getAddressFromWif
} = bitcore;

const {
  TxOut,
  TxIn,
  Transaction,
  getTxId,
  signTxIn
} = Transactions;

// Get the private key of Node from the file
const getWIF = () => {
  if (fs.existsSync(privateKeyLocation)) {
    const buffer = fs.readFileSync(privateKeyLocation, "utf8");
    return buffer.toString();
  }
  const newPrivateKey = generatePrivateWIF();
  fs.writeFileSync(privateKeyLocation, newPrivateKey);
  return newPrivateKey;
};

const getChainID = () => {
  return getAddress().toString();
};

const setWIF = (newPrivateWif) => {
  if (fs.existsSync(privateKeyLocation)) {
    fs.unlinkSync(privateKeyLocation);
  }
  fs.writeFileSync(privateKeyLocation, newPrivateWif);
};

const getAddress = () => {
  return getAddressFromWif(getWIF());
};

const getTokenBalance = (sym, address, uTxOuts) => {
  const myUTxOuts = uTxOuts.filter(uTxOut => ((uTxOut.sym === sym) && (uTxOut.address === address)))
    .map(uTxO => uTxO.amount);
  if( myUTxOuts.length === 0) return 0;
  return myUTxOuts.reduce((a,b) => a+b);
};

const getTotalBalance = (address, uTxOuts) => {
  const myUTxOuts = uTxOuts.filter(uTxO => uTxO.address === address);
  let tokens = [];

  for (const myUTxOut of myUTxOuts) {
    const inx = tokens.findIndex(token => token.sym === myUTxOut.sym);
    if(inx < 0) {
      tokens.push({
        sym: myUTxOut.sym, 
        amount: myUTxOut.amount
      });
    } else {
      tokens[inx].amount += myUTxOut.amount;
    }
  }
  return tokens;
};

// Get uTxOuts by address
const findUTxOuts = (address, uTxOuts) =>
  _.filter(uTxOuts, uTxOut => uTxOut.address === address);

const findUTxOutsWithSym = (sym, address, uTxOuts) =>
  _.filter(uTxOuts, uTxOut => uTxOut.sym === sym && uTxOut.address === address);

const findAmountOnTxOuts = (amountNeeded, myUTxOuts) => {
  let currentAmount = 0;
  const includedUTxOuts = [];

  for (const myUTxOut of myUTxOuts) {

    includedUTxOuts.push(myUTxOut);

    currentAmount = currentAmount + myUTxOut.amount;
    if (currentAmount >= amountNeeded) {
      const leftOverAmount = currentAmount - amountNeeded;
      return { includedUTxOuts, leftOverAmount };
    }
  }
  throw Error("Not enough founds");
};

const createTxOuts = (receiverAddress, myAddress, amount, sym, leftOverAmount) => {
  const receiverTxOut = new TxOut(receiverAddress, amount, sym);
  if (leftOverAmount === 0) {
    return [receiverTxOut];
  } else {
    const leftOverTxOut = new TxOut(myAddress, leftOverAmount, sym);
    return [receiverTxOut, leftOverTxOut];
  }
};

// Functiont to filter the txOuts from the mempool
const filterTxOutsfromMemPool = (uTxOuts, memPool) => {
  // First we get all the txIns from the memPool
  const txIns = _(memPool)
    .filter(pool => pool.type === 'tx')
    .map(pool => pool.data.txIns)
    .flatten()
    .value();
  // Then we get an array ready to add the txIns that we are gonna remove
  const removables = [];

  for (const uTxOut of uTxOuts) {

    const txIn = _.find(txIns, aTxIn => {
      return (
        aTxIn.txOutIndex === uTxOut.txOutIndex &&
        aTxIn.txOutId === uTxOut.txOutId
      );
    });

    if (txIn !== undefined) {
      removables.push(uTxOut);
    }
  }
  return _.without(uTxOuts, ...removables);
};

// At last, we create a transaction.
const createTransaction = (
  receiverAddress,
  amount,
  sym,
  privateWif,
  uTxOuts,
  memPool,
  memo
) => {
  const myAddress = getAddressFromWif(privateWif);
  const strAddress = myAddress.toString();

  const myUTxOuts = uTxOuts.filter(uTxO => 
    uTxO.sym === sym && uTxO.address === strAddress);
  const filteredUTxOuts = filterTxOutsfromMemPool(myUTxOuts, memPool);
  const { includedUTxOuts, leftOverAmount } = findAmountOnTxOuts(
    amount,
    filteredUTxOuts
  );
  const toUnsignedTxIn = uTxOut => {
    const txIn = new TxIn();
    txIn.txOutId = uTxOut.txOutId;
    txIn.txOutIndex = uTxOut.txOutIndex;
    return txIn;
  };
  const unsignedTxIns = includedUTxOuts.map(toUnsignedTxIn);
  
  const tx = new Transaction();
  tx.txIns = unsignedTxIns;
  tx.txOuts = createTxOuts(receiverAddress, strAddress, amount, sym, leftOverAmount);
  tx.id = getTxId(tx);
  // Sign each one of the txIn
  tx.txIns = tx.txIns.map((txIn, index) => {
    txIn.signature = signTxIn(tx, index, privateWif, uTxOuts, myAddress);
    return txIn;
  });
  tx.amount = amount;
  tx.sym = sym;
  tx.from = strAddress;
  tx.to = receiverAddress;
  tx.memo = memo;
  return tx;
};
const createCustomTransaction = (address, sym, amount, memo, blockIndex) => {
  const tx = new Transaction();
  // Empty txIn because is coins out of nowhere
  const txIn = new TxIn();
  txIn.signature = "";
  txIn.txOutId = "";
  // We give the index of the block as the txOutIndex
  txIn.txOutIndex = blockIndex;
  // Only one txIn
  tx.txIns = [txIn];
  tx.txOuts = [new TxOut(address, amount, sym)];
  tx.id = getTxId(tx);
  tx.amount = amount;
  tx.sym = sym;
  tx.from = "CREATE";
  tx.to = address;
  tx.memo = memo;
  return tx;
};

module.exports = {
  getWIF,
  setWIF,
  getChainID,
  getAddress,
  createTransaction,
  createCustomTransaction,
  getTokenBalance,
  getTotalBalance,
  findUTxOuts,
  findUTxOutsWithSym
};
