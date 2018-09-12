const CryptoJS = require("crypto-js"),
  _ = require("lodash"),
  Transactions = require("./transactions"),
  MemPool = require("./mempool"),
  Wallet = require("./wallet");

const {
  processTransactions
} = Transactions;
const {
  getTokenBalance,
  getTotalBalance,
  getPublicFromWallet,
  getChainID,
  createTransaction,
  createCustomTransaction,
  findUTxOuts
} = Wallet;

const { addTxToMemPool, 
  addPoolToMemPool, 
  getMemPool, 
  updateTxMemPool,
  updateExMemPool } = MemPool;

// Block Structure
class Block {
  constructor(index, hash, previousHash, timestamp, tx, ex, chain_id) {
    this.index = index;
    this.hash = hash;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.tx = tx;
    this.ex = ex;
    this.chain_id = chain_id;
  }
}

// Hardcode the genesisBlock
const genesisBlock = new Block(
  0,
  "582936e06e610b1d0b9d7e68c64e6ab47220a54ee95d227fbb4002f691a50e02",
  "",
  1532867613527,
  [],
  [],
  "system"
);
// Create the blockchain with the Genesis Block hardcoded into it.
// 1. getBlocksHash(genesisBlock);
// 2. getTxId(genesisTx);
//    console.log("KEY:" + getTxId(genesisTx));

let blockchain = [genesisBlock];

// Put the uTxOuts on a list
let uTxOutsList = [];

// Function to replace the uTxOutsList
const updateUTxOutsList = newUTxOuts => {
  uTxOutsList = newUTxOuts;
};

// Create the hash of the block
const createHash = (index, previousHash, timestamp, tx, ex, chain_id) =>
  CryptoJS.SHA256(
    index + previousHash + timestamp + JSON.stringify(tx) + JSON.stringify(ex) + chain_id
  ).toString();

// Find a block
const createBlock = (index, previousHash, timestamp, tx, ex, chain_id) => {
  // We create a hash with the contents of our candidate block
  const hash = createHash(
    index,
    previousHash,
    timestamp,
    tx,
    ex,
    chain_id
  );
  return new Block(
    index,
    hash,
    previousHash,
    timestamp,
    tx,
    ex,
    chain_id
  );
};

// Get the last block from the blockchain
const getNewestBlock = () => blockchain[blockchain.length - 1];

// Get blockchain
const getBlockchain = () => blockchain;

// Timestamp
const getTimeStamp = () => new Date().getTime();

// Create a new raw block.
const createNewRawBlock = (tx, ex) => {
  const previousBlock = getNewestBlock();
  const newBlockIndex = previousBlock.index + 1;
  const newtimestamp = getTimeStamp();

  const chain_id = getChainID();

  const newBlock = createBlock(
    newBlockIndex,
    previousBlock.hash,
    newtimestamp,
    tx,
    ex,
    chain_id
  );
  if (addBlockToChain(newBlock)) {
    // We do this to avoid circular requirements
    require("./p2p").broadcastNewBlock();
    return newBlock;
  } else {
    return null;
  }
};

const checkMemPoolCreateNewBlock = () => {
  const mempool = getMemPool();
  if( mempool && mempool.length>0) {
    const tx = [], ex = [];
    for( const pool of mempool) {
      if( pool.type === 'tx'){
        tx.push(pool.data);
      } else if( pool.type === 'ex') {
        ex.push(pool.data);
      }
    }
    return createNewRawBlock(tx, ex);
  }
  return null;
};

// Get any block's hash
const getBlockHash = block =>
  createHash(
    block.index,
    block.previousHash,
    block.timestamp,
    block.tx,
    block.ex,
    block.chain_id
  );

// Check if the structure of the Block and it's types are what they should be
const isBlockStructureValid = block => {
  return (
    typeof block.index === "number" &&
    typeof block.hash === "string" &&
    typeof block.previousHash === "string" &&
    typeof block.timestamp === "number" &&
    typeof block.tx === "object" &&
    typeof block.ex === "object"
  );
};

// Valiate new blocks
const isBlockValid = (newBlock, oldBlock) => {
  // Check if the structure of the new block is correct
  if (!isBlockStructureValid(newBlock)) {
    console.log("The candidate block structure is not valid");
    return false;
  } else if (oldBlock.index + 1 !== newBlock.index) {
    // Check if the index of the new block is greater than the old block's index
    console.log("The candidate block doesnt have a valid index");
    return false;
    // Check if the new block's previous hash is the same as the old block's hash
  } else if (oldBlock.hash !== newBlock.previousHash) {
    console.log(
      "The previousHash of the candidate block is not the hash of the latest block"
    );
    return false;
    // Check if the new block's hash is the same as the hash taht we calculate
  } else if (getBlockHash(newBlock) !== newBlock.hash) {
    console.log("The hash of this block is invalid");
    return false;
  }
  return true;
};

// Check if the chain is valid
const isChainValid = foreignChain => {
  const isGenesisValid = block => {
    return JSON.stringify(block) === JSON.stringify(genesisBlock);
  };
  // Check if the genesis block is the same in our chain and theirs
  if (!isGenesisValid(foreignChain[0])) {
    return null;
  }
  // Here we loop and validate each block + its tx's
  let foreignUTxOuts = [];
  for (let i = 0; i < foreignChain.length; i++) {
    const currentBlock = foreignChain[i];
    if (i !== 0 && !isBlockValid(currentBlock, foreignChain[i - 1])) {
      return null;
    }
    if( currentBlock.tx.length > 0) {
      foreignUTxOuts = processTransactions(
        currentBlock.tx,
        foreignUTxOuts,
        currentBlock.index
      );
      if (foreignUTxOuts === null) {
        return null;
      }
    }
  }
  return foreignUTxOuts;
};

// Replace Chain
const replaceChain = async (newChain) => {
  const foreignUTxOuts = isChainValid(newChain);
  const validChain = foreignUTxOuts !== null;
  if (validChain) {
    blockchain = newChain;
    updateUTxOutsList(foreignUTxOuts);
    updateTxMemPool(getUTxOutsList());
    require("./p2p").broadcastNewBlock();
    return true;
  }
  return false;
};

const replacePageChain = newChain => {
  let addCount = 0;
  for (let i = 0; i < newChain.length; i++) {
    const newBlock = newChain[i];
    if (!isBlockValid(newBlock, getNewestBlock())) break;

    if( newBlock.tx.length > 0) {
      const processedTxs = processTransactions(
        newBlock.tx,
        uTxOutsList,
        newBlock.index
      );
      if (processedTxs === null) {
        break;
      }
      updateUTxOutsList(processedTxs);
    }
    addCount++;
    blockchain.push(newBlock);

    if( newBlock.tx.length > 0) {
      updateTxMemPool(uTxOutsList);
    }
    if( newBlock.ex.length > 0) {
      updateExMemPool(newBlock.ex);
    }
  }
  return addCount === newChain.length ? true : false;
};

// Add block to chain
const addBlockToChain = newBlock => {
  if (isBlockValid(newBlock, getNewestBlock())) {
    // Validate the Txs and update the uTxOutsList
    if( newBlock.tx.length > 0) {
      const processedTxs = processTransactions(
        newBlock.tx,
        uTxOutsList,
        newBlock.index
      );
      if (processedTxs === null) {
        console.log("Couldnt process data.txs");
        return false;
      }
      updateUTxOutsList(processedTxs);
    }
    // Add the block to the chain and update the uTxOutsList
    blockchain.push(newBlock);
    if( newBlock.tx.length > 0) {
      updateTxMemPool(uTxOutsList);
    }
    if( newBlock.ex.length > 0) {
      updateExMemPool(newBlock.ex);
    }
    require("./p2p").broadcastMempool();
    return true;
  } else {
    return false;
  }
};

// Deep Clone the uTxOutsList, uTxOutsList
const getUTxOutsList = () => _.cloneDeep(uTxOutsList);

const getUTxOutsRef = () => uTxOutsList;

const sendRomoteTransaction = (fromWif, to, amount, sym, memo) => {
  const tx = createTransaction(
    to,
    amount,
    sym,
    fromWif,
    getUTxOutsList(),
    getMemPool(),
    memo
  );
  addTxToMemPool(tx, getUTxOutsList());
  require("./p2p").broadcastMempool();
  return tx;
};
const createTokenTransaction = (address, sym, amount, memo) => {
  const tx = createCustomTransaction(
    address, 
    sym,
    amount,
    memo,
    getNewestBlock().index + 1
  );
  addTxToMemPool(tx, getUTxOutsList());
  require("./p2p").broadcastMempool();
  return tx;
};

// Getting myUTxOuts
const myUTxOuts = () => findUTxOuts(getPublicFromWallet(), getUTxOutsList());

// Handle a Tx when it's received from another peer
const handleIncomingPool = pool => {
  addPoolToMemPool(pool, getUTxOutsList());
};

const getAddressTokenBalance = (address, sym) => {
  return getTokenBalance(sym, address, uTxOutsList);
};
const getAddressTotalBalance = (address) => {
  return getTotalBalance(address, uTxOutsList);
};

module.exports = {
  getBlockchain,
  checkMemPoolCreateNewBlock,
  getNewestBlock,
  isBlockStructureValid,
  addBlockToChain,
  replaceChain,
  replacePageChain,
  sendRomoteTransaction,
  createTokenTransaction,
  getUTxOutsList,
  getUTxOutsRef,
  myUTxOuts,
  handleIncomingPool,
  getAddressTokenBalance,
  getAddressTotalBalance
};
