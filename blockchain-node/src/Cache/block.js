const Blockchain = require("../blockchain");

const { getBlockchain } = Blockchain;

let TotalInfos = {
  length: 0,
  txCount: 0,
  tokens: []
};


const getTotalInfos = () => {
  const blocks = getBlockchain();
  const length = blocks.length;

  let curInfos = {...TotalInfos};

  for( let i=curInfos.length; i<length; i++) {
    const block = blocks[i];
    // sum of transactions
    curInfos.txCount += block.tx.length;
    curInfos.txCount += block.ex.length;

    block.tx.forEach(tx => {
      const tinx = curInfos.tokens.findIndex(token => token.sym === tx.sym);
      if(tinx < 0) {
        curInfos.tokens.push({
          sym: tx.sym,
          cbSum: (tx.from === 'CREATE' ? tx.amount : 0),
          txSum: (tx.from === 'CREATE' ? 0 : tx.amount)
        });
      } else {
        if(tx.from === 'CREATE') {
          curInfos.tokens[tinx].cbSum += tx.amount;  
        } else {
          curInfos.tokens[tinx].txSum += tx.amount;  
        }
      }
    });
  }
  curInfos.length = length;
  TotalInfos = curInfos;
  return TotalInfos;
};
const curTokenTotalAllAmount = () => {
  const sum = TotalInfos.tokens.map(token => token.txSum)
    .reduce((a,b) => a+b);
  return sum;
};
const curTokenTotalTxAmount = (sym) => {
  const tinx = TotalInfos.tokens.findIndex(token => token.sym === sym);
  if(tinx < 0) return 0;
  return TotalInfos.tokens[tinx].txSum;
};
const curTokenTotalPdAmount = (sym) => {
  const tinx = TotalInfos.tokens.findIndex(token => token.sym === sym);
  if(tinx < 0) return 0;
  return TotalInfos.tokens[tinx].cbSum;
};

const getTotalTxAmount = (sym) => {
  getTotalInfos();
  return curTokenTotalTxAmount(sym);
};
const getTotalPdVolume = (sym) => {
  getTotalInfos();
  return curTokenTotalPdAmount(sym);
};

const refreshTotalInfos = () => {
  TotalInfos = {
    length: 0,
    txCount: 0,
    tokens: []
  };
  getTotalInfos();
};

module.exports = {
  getTotalInfos,
  curTokenTotalAllAmount,
  curTokenTotalTxAmount,
  curTokenTotalPdAmount,
  getTotalTxAmount,
  getTotalPdVolume,
  refreshTotalInfos
};