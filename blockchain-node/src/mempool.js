const _ = require("lodash"),
  Transactions = require("./transactions");

const { validateTx } = Transactions;

// Here we are gonna save all the unconfirmed Tx's
// {type: 'tx' or 'ex', data}
let memPool = [];

const getMemPool = () => {
  return _.cloneDeep(memPool);
};

const getTxInsOnPool = pools => {
  return _(pools)
    .filter(pool => pool.type === 'tx')
    .map(pool => pool.data.txIns)
    .flatten()
    .value();
};
const getExInsOnPool = pools => {
  return _(pools)
    .filter(pool => pool.type === 'ex')
    .map(pool => pool.data.id)
    .flatten()
    .value();
};

const isTxValidForPool = (tx, Pools) => {
  const txPoolIns = getTxInsOnPool(Pools);

  const isTxAlreadyInPool = (txIns, txIn) => {
    return _.find(txIns, txPoolIn => {
      return (
        txIn.txOutIndex === txPoolIn.txOutIndex &&
        txIn.txOutId === txPoolIn.txOutId
      );
    });
  };

  for (const txIn of tx.txIns) {
    if (isTxAlreadyInPool(txPoolIns, txIn)) {
      return false;
    }
  }
  return true;
};
const isExValidForPool = (ex, Pools) => {
  const exPools = getExInsOnPool(Pools);

  return _.find(exPools, exPoolIn => {
    return (
      ex.id === exPoolIn.id
    );
  });
};

const addTxToMemPool = (tx, uTxOuts) => {
  //if( tx.from != 'CREATE') {
    if (!validateTx(tx, uTxOuts)) {
      throw Error("This Tx is invalid, it won't be added");
    } else if (!isTxValidForPool(tx, memPool)) {
      throw Error("This Tx is invalid for the pool, it won't be added");
    }
  //}
  memPool.push({
    type: 'tx', 
    data: tx
  });
};

const addPoolToMemPool = (pool, uTxOuts) => {
  if( !pool || !pool.type) return;
  
  if( pool.type === 'tx') {
    addTxToMemPool(pool.data, uTxOuts);
  } else {
    if (isExValidForPool(pool.data, memPool)) {
      throw Error("This Tx is invalid for the pool, it won't be added");
    }
    memPool.push(pool);
  }
};

// Is a TxIn inside of the uTxOuts?
const hasTxIn = (txIn, uTxOuts) => {
  const foundTxIn = uTxOuts.find(uTxO => {
    return uTxO.txOutId === txIn.txOutId && uTxO.txOutIndex === txIn.txOutIndex;
  });
  return foundTxIn !== undefined;
};

const updateTxMemPool = uTxOuts => {
  // We are gonna keep a list of the invalid Txs that we find
  const invalidTxs = [];
  for (const pool of memPool) {
    if( pool.type === 'tx') {
      for (const txIn of pool.data.txIns) {
        if (!hasTxIn(txIn, uTxOuts)) {
          invalidTxs.push(pool.data);
          break;
        }
      }
    }
  }
  if (invalidTxs.length > 0) {
    for (const rtx of invalidTxs) {
      const inx = memPool.findIndex( pool => 
        pool.type === 'tx' && pool.data.id === rtx.id);
      if( inx > -1) {
        memPool.splice(inx, 1);
      }
    }
  }
};
const updateExMemPool = exs => {
  if (exs.length > 0) {
    for (const ex of exs) {
      const inx = memPool.findIndex( pool => 
        pool.type === 'ex' && pool.data.id === ex.id);
      if( inx > -1) {
        memPool.splice(inx, 1);
      }
    }
  }
};

module.exports = {
  addTxToMemPool,
  addPoolToMemPool,
  getMemPool,
  updateTxMemPool,
  updateExMemPool
};
