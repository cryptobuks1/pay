require('dotenv').config();
process.env.TZ = 'Asia/Seoul';

const express = require("express"),
  http = require("http"),
  _ = require("lodash"),
  cors = require("cors"),
  bodyParser = require("body-parser"),
  fetch = require("node-fetch"),
  // localtunnel = require("localtunnel"),
  Blockchain = require("./blockchain"),
  P2P = require("./p2p"),
  Wallet = require("./wallet"),
  ChainNode = require("./chainnode"),
  Distribution = require("./distribution");

const {
  pingNode,
  TaskDistribution
} = Distribution;

const {
  getTotalInfos,
  curTokenTotalAllAmount,
  curTokenTotalTxAmount,
  curTokenTotalPdAmount,
  getTotalTxAmount,
  getTotalPdVolume,
  refreshTotalInfos
} =  require("./Cache/block");

const {
  getBlockchain,
  checkMemPoolCreateNewBlock,
  sendRomoteTransaction, // 2018-05-25
  createTokenTransaction,
  getAddressTokenBalance,
  getAddressTotalBalance
} = Blockchain;

const { connectToPeers, startP2PServer, startP2PServerLink, 
  reconnectNode, disconnectNode } = P2P;

const {getChainNodeList, addChainNode} = ChainNode;
const { setWIF, getChainID } = Wallet;
const EX = process.env.EX;

const { 
  SUPER_NODE_PORT: NodePort,
  CHAIN_NODE_PORT: ChainNodePort,
  ACCOUNT_SVR,
  MAIN_TOKEN_SYM,
  SYSTEM_ACCOUNT_EMAIL,
  THIS_NODE,
  SUPER_NODE } = process.env;

let CTRL_SETUP = {
  CREATE_TOKEN_FEE: 0,
  ACTIVE_TRANSACTION: true,
  CREATE_BLOCK_PERMISSION: (EX === 'SUPER' ? true : false),
  EX_MODE: EX,
  LOCK_ADDRESS: []
};

const app = express();
app.use(bodyParser.json());
app.use(cors());

// ================== Public API ====================
app.get("/search/:key", (req, res) => {
  const key = req.params.key;
  const blocks = getBlockchain();
  let block = null, tx = null;
  try {
    if( key.length < 20) {
      block = _.find(blocks, { index: Number(key) });
    } else {
      block = _.find(blocks, { hash: key }); // search hash
      if (block === undefined) {
        tx = _(blocks)
          .map(blocks => blocks.tx)
          .flatten()
          .find({ id: key });
      }
    }
    if( (block === null || block === undefined) && 
        (tx === null || tx === undefined) ) {
      res.status(400).send("Data not found");
    } else {
      if(block) {
        res.send({block: block});
      } else {
        res.send({tx: tx});
      }
    }
  } catch(e) {
    res.status(400).send("Data not found");
  }
});

app.get("/status", (req, res) => {
  try {
    const infos = getTotalInfos();
    res.send({
      blockCount: infos.length,
      txCount: infos.txCount,
      txSum: curTokenTotalAllAmount(),
      cbSum: curTokenTotalPdAmount(MAIN_TOKEN_SYM)
    });
  } catch(e) {
    res.status(400).send(e.message);
  }
});
app.get("/refresh-status", (req, res) => {
  try {
    refreshTotalInfos();
    const infos = getTotalInfos();
    res.send({
      blockCount: infos.length,
      txCount: infos.txCount,
      txSum: curTokenTotalTxAmount(MAIN_TOKEN_SYM),
      cbSum: curTokenTotalPdAmount(MAIN_TOKEN_SYM)
    });
  } catch(e) {
    res.status(400).send(e.message);
  }
});

app.get("/transactions-volume/:sym", (req, res) => {
  const sym = req.params.sym;
  try {
    res.status(200).send({
      sym: sym,
      amount: getTotalTxAmount(sym)
    });
  } catch(e) {
    res.status(400).send(e.message);
  }
});
app.get("/production-volume/:sym", (req, res) => {
  const sym = req.params.sym;
  try {
    res.status(200).send({
      sym: sym,
      amount: getTotalPdVolume(sym)
    });
  } catch(e) {
    res.status(400).send(e.message);
  }
});

app.get("/blocks/latest", (req, res) => {
  const lastBlocks = _(getBlockchain())
    .slice(-10)
    .reverse();
  res.send(lastBlocks);
});

app.get("/blocks/:key", (req, res) => {
  const key = req.params.key;
  try {
    const block = key.length < 30 ? 
    _.find(getBlockchain(), { index: Number(key) }) :
    _.find(getBlockchain(), { hash: key });

    if (block === undefined) {
       res.status(400).send("Block not found");
    } else {
      res.send(block);
    }
  } catch(e) {
    res.status(500).send("Block not found");
  }
});

app.get("/transactions/:id", (req, res) => {
  const tx = _(getBlockchain())
    .map(blocks => blocks.tx)
    .flatten()
    .find({ id: req.params.id });
  if (tx === undefined) {
    res.status(400).send("Transaction not found");
  }
  res.send(tx);
});

app.post("/balance", async (req, res) => {
  const { email, address } = req.body;
  try {
    if(email) {
      const response = await fetch(`${ACCOUNT_SVR}/api/v1/account/find`, {
        method: "POST",
        body: JSON.stringify({email}),
        headers: { "Content-Type": "application/json" }
      });
      const account = await response.json();
      res.send({ 
        email, 
        balance: getAddressTotalBalance(account.address)
    });
    } else if(address) {
      res.send({ address, balance: getAddressTotalBalance(address) });
    } else {
      res.status(400).send('Bad Request');
    }
  } catch(e) {
    res.status(400).send(e.message);
  }
});

app.post("/sent-history", (req, res) => {
  const { address, index } = req.body;
  if (address === undefined || index === undefined) {
    res.status(400).send("bad request");
    return;
  }
  try {
    const blocks = getBlockchain(); 
    const lastIndex = blocks[blocks.length-1].index;
    const txs = _(blocks)
      .filter(block => block.index > index)
      .map(block => block.tx)
      .flatten()
      .filter(Tx => Tx.from === address)
      .reverse()
      .value();
    res.send({ txs, lastIndex });
  } catch(e) {
    res.status(500).send(e.message);
  }
});

app.post("/recv-history", (req, res) => {
  const { address, index } = req.body;
  if (address === undefined || index === undefined) {
    res.status(400).send("bad request");
    return;
  }
  try {
    const blocks = getBlockchain(); 
    const lastIndex = blocks[blocks.length-1].index;
    const txs = _(blocks)
      .filter(block => block.index > index)
      .map(block => block.tx)
      .flatten()
      .filter(Tx => Tx.to === address)
      .reverse()
      .value();
    res.send({ txs, lastIndex });
  } catch(e) {
    res.status(400).send(e.message);
  }
});
// ================== QR-code API ====================
app.post("/qr-register", async (req, res) => {
  if (!req.body) {
    res.status(400).send("bad request (node)");
    return;
  }
  try {
    const response = await fetch(`${ACCOUNT_SVR}/api/v1/qrdata/register`, {
      method: "POST",
      body: JSON.stringify(req.body),
      headers: { "Content-Type": "application/json" }
    });
    const resp = await response.json();
    res.status(response.status).send(resp);
  } catch (e) {
    res.status(400).send(e.message);
  }
});
app.post("/qr-find", async (req, res) => {
  if (!req.body) {
    res.status(400).send("bad request");
    return;
  }
  try {
    const response = await fetch(`${ACCOUNT_SVR}/api/v1/qrdata/find`, {
      method: "POST",
      body: JSON.stringify(req.body),
      headers: { "Content-Type": "application/json" }
    });
    const resp = await response.json();
    res.status(response.status).send(resp);
  } catch (e) {
    res.status(400).send(e.message);
  }
});
app.get("/qr-remove/:id", async (req, res) => {
  const id = req.params.id;
  if (id  === undefined) {
    res.status(400).send("bad request");
    return;
  }
  try {
    const response = await fetch(`${ACCOUNT_SVR}/api/v1/qrdata/remove/${id}`);
    const resp = await response.json();
    res.status(response.status).send(resp);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// ================== BlockChain API ====================
let systemAccount = null;
const getSystemAccount = async () => {
  if( systemAccount === null ) {
    const resSys = await fetch(`${ACCOUNT_SVR}/api/v1/account/find`, {
      method: "POST",
      body: JSON.stringify({email: SYSTEM_ACCOUNT_EMAIL}),
      headers: { "Content-Type": "application/json" }
    });
    const sysAccount = await resSys.json();
    if(resSys.status < 400) {
      systemAccount = sysAccount;
    }
  }
  return systemAccount;
};
const getAccountTokenAmount = (account, sym) => {
  if(!account || !sym || !account.amounts) return 0;
  const finx = account.amounts.findIndex(item => item.sym === sym);
  if(finx < 0) return 0;
  return account.amounts[finx].amount;
}

app.post("/signup", async (req, res) => {
  const {email, pw, nick} = req.body;
  const level = req.body.level ? req.body.level : 'user';
  if (
    email === undefined || 
    pw === undefined || 
    nick === undefined
  ) {
    res.status(400).send("bad request");
    return;
  }

  try {
    const response = await fetch(`${ACCOUNT_SVR}/api/v1/account/register`, {
      method: "POST",
      body: JSON.stringify({email, pw, nick, level}),
      headers: { "Content-Type": "application/json" }
    });
    const resp = await response.json();
    res.status(response.status).send(resp);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

app.post("/login", async (req, res) => {
  const { email, pw } = req.body;
  if (email === undefined || pw === undefined) {
    res.status(400).send("bad request");
    return;
  }

  try {
    const response = await fetch(`${ACCOUNT_SVR}/api/v1/account/login`, {
      method: "POST",
      body: JSON.stringify({email, pw}),
      headers: { "Content-Type": "application/json" }
    });
    const resp = await response.json();
    res.status(response.status).send(resp);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

app.post("/newpw", async (req, res) => {
  try {
    const response = await fetch(`${ACCOUNT_SVR}/api/v1/account/newpw`, {
      method: "POST",
      body: JSON.stringify(req.body),
      headers: { "Content-Type": "application/json" }
    });
    const resp = await response.json();
    res.status(response.status).send(resp);
  } catch (e) {
    res.status(400).send(e.message);
  }
});
app.post("/chgpw", async (req, res) => {
  let response = null;
  try {
    response = await fetch(`${ACCOUNT_SVR}/api/v1/account/chgpw`, {
      method: "POST",
      body: JSON.stringify(req.body),
      headers: { "Content-Type": "application/json" }
    });
    const resp = await response.json();
    res.status(response.status).send(resp);
  } catch (e) {
    res.status(response ? response.status : 400)
      .send(e.message);
  }
});

app.post("/create-transaction", async (req, res) => {
  const {ACTIVE_TRANSACTION} = CTRL_SETUP;
  if(!ACTIVE_TRANSACTION) {
    res.status(400).send("This node is not transactionable");
    return;
  }
  const { sender, recv, sym, amount, memo, key } = req.body;
  if (
    sender === undefined || recv === undefined ||
    sym === undefined || amount === undefined || 
    memo === undefined || key === undefined || (amount < 0)
  ) {
    res.status(400).send("bad request");
    return;
  }

  try {
    const response = await fetch(`${ACCOUNT_SVR}/api/v1/account/txinfo`, {
      method: "POST",
      body: JSON.stringify({sender, recv, key}),
      headers: { "Content-Type": "application/json" }
    });
    const accounts = await response.json();
    if(response.status >= 400) {
      res.status(response.status).send('error ...');
      return;
    }
    if(accounts.sender.address === accounts.recv.address){
      res.status(400).send('Can not trade same address');
      return;
    }
    if(accounts.sender.status === "block"){
      res.status(400).send(`${accounts.sender.email} is not transactionable`);
      return;
    }
    if(accounts.recv.status === "block"){
      res.status(400).send(`${accounts.recv.email} is not transactionable`);
      return;
    }

    const resp = sendRomoteTransaction(
      accounts.sender.wif, 
      accounts.recv.address, 
      amount, 
      sym, 
      memo
    );
    res.send(resp);

    const variationAmounts = [];
    variationAmounts.push({
      address: accounts.sender.address,
      sym,
      amount: -amount
    });
    variationAmounts.push({
      address: accounts.recv.address,
      sym,
      amount
    });
    await fetch(`${ACCOUNT_SVR}/api/v1/account/variation-amounts`, {
      method: "POST",
      body: JSON.stringify({infos: variationAmounts}),
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    res.status(400).send(e.message);
  }
});

app.post("/create-token", async (req, res) => {
  const {ACTIVE_TRANSACTION} = CTRL_SETUP;
  if(!ACTIVE_TRANSACTION) {
    res.status(400).send("This node is not transactionable");
    return;
  }
  const { email, sym, amount, memo, key } = req.body;
  if (
    email === undefined || sym === undefined ||
    amount === undefined || key === undefined
  ) {
    res.status(400).send("bad request");
    return;
  }

  try {
    const sysAccount = getSystemAccount();
    if(sysAccount === null) {
      res.status(500).send('not found system-account');
      return;
    }
    const response = await fetch(`${ACCOUNT_SVR}/api/v1/account/detail`, {
      method: "POST",
      body: JSON.stringify({email, key}),
      headers: { "Content-Type": "application/json" }
    });
    const account = await response.json();
    if(response.status >= 400) {
      res.status(response.status).send(account);
      return;
    }
    if(account.status === "block"){
      res.status(400).send(`${account.email} is not transactionable`);
      return;
    }

    if( account.cToken.length > 0) {
      if(account.cToken[0] !== sym) {
        res.status(500).send('One-time token generation');
        return;
      }
    }
    if(account.level !== 'system' && CTRL_SETUP.CREATE_TOKEN_FEE > 0) {
      const main_amount = getAddressTokenBalance(account.address, MAIN_TOKEN_SYM);
      if(main_amount < CTRL_SETUP.CREATE_TOKEN_FEE){
        res.status(500).send('The amount is not enough.');
        return;
      }
    }
    // register, currency
    const response2 = await fetch(`${ACCOUNT_SVR}/api/v1/currency/register`, {
      method: "POST",
      body: JSON.stringify({
        name: memo, 
        sym, 
        volume: amount, 
        email, 
        key
      }),
      headers: { "Content-Type": "application/json" }
    });
    const currency = await response2.json();
    if(response2.status >= 400) {
      res.status(response2.status).send(currency);
      return;
    }

    const resp = await createTokenTransaction(
      account.address, 
      sym, 
      amount,
      memo);

    let variationAmounts = [{
      address: account.address,
      sym,
      amount
    }];

    if(account.level !== 'system' && CTRL_SETUP.CREATE_TOKEN_FEE > 0) {
      await sendRomoteTransaction(
        account.wif, 
        sysAccount.address, 
        CTRL_SETUP.CREATE_TOKEN_FEE, 
        MAIN_TOKEN_SYM, 
        'Token creation fee'
      );
      variationAmounts = [...variationAmounts, {
        address: account.address,
        sym: MAIN_TOKEN_SYM,
        amount: -CTRL_SETUP.CREATE_TOKEN_FEE
      }];
      variationAmounts = [...variationAmounts, {
        address: sysAccount.address,
        sym: MAIN_TOKEN_SYM,
        amount: CTRL_SETUP.CREATE_TOKEN_FEE
      }];
    }

    await fetch(`${ACCOUNT_SVR}/api/v1/account/variation-amounts`, {
      method: "POST",
      body: JSON.stringify({infos: variationAmounts}),
      headers: { "Content-Type": "application/json" }
    });

    res.send({currency, tx: resp});

  } catch (e) {
    res.status(400).send(e.message);
  }
});

// ============== Manage Node List ===============
app.post("/node-login", async (req, res) => {
  const { email, pw } = req.body;
  if (email === undefined || pw === undefined) {
    res.status(400).send("bad request");
    return;
  }

  try {
    const response = await fetch(`${ACCOUNT_SVR}/api/v1/account/login`, {
      method: "POST",
      body: JSON.stringify({email, pw}),
      headers: { "Content-Type": "application/json" }
    });
    const resp = await response.json();
    if(response.status === 200) {
      const {key} = resp;

      const response2 = await fetch(`${ACCOUNT_SVR}/api/v1/account/detail`, {
        method: "POST",
        body: JSON.stringify({email, key}),
        headers: { "Content-Type": "application/json" }
      });
      const resp2 = await response2.json();
      if(response2.status === 200) {
        setWIF(resp2.wif);
        res.status(response2.status).send({
          ChainID: getChainID()
        });
        return;
      }
    }
    res.status(response.status).send(resp);
  } catch (e) {
    res.status(400).send(e.message);
  }
});
app.get("/chain-lists", (req, res) => {
  res.send({chain: getChainNodeList()});
});
app.get("/peerinfo", (req, res) => {
  res.send({url: THIS_NODE, level: EX, data: ''});
});
app.post("/addChain", (req, res) => {
  const {peer} = req.body;
  try{
    fetch(`${peer}/peerinfo`)
    .then(results => results.json())
    .then(data => {
      if( data.url ) {
        addChainNode(data.url, data.level, data.data);
      }
    });
    res.send();
  } catch(e) {
    res.status(400).send("addChain, :"+peer);
  }
});
app.post("/connectPeer", (req, res) => {
  try{
    const peerUrl = req.body.peer === 'super' ? 
      SUPER_NODE : req.body.peer;
    connectToPeers(peerUrl);

    res.send({peer: peerUrl});
  } catch(e) {
    res.status(400).send("addPeer, "+e.message);
  }
});
app.get("/reconnectPeer", (req, res) => {
  try{
    res.send({ peers: reconnectNode()});
  } catch(e) {
    res.status(400).send("reconnectPeer, "+e.message);
  }
});
app.post("/disconnectPeer", (req, res) => {
  try{
    const peerUrl = req.body.peer === 'super' ? 
      SUPER_NODE : req.body.peer;
    res.send({ return: disconnectNode(peerUrl)});
  } catch(e) {
    res.status(400).send("disconnectPeer, "+e.message);
  }
});
// ============== sys config ===============
let SYS_CONFIG = {
  super: SUPER_NODE,
  account: ACCOUNT_SVR,
  walletNode: SUPER_NODE,
  androidWallet: '1000',
  iosWallet: '1000',
  notice: '',
  exit: ''
};
app.get("/sys-config", (req, res) => {
  res.send(SYS_CONFIG);
});
app.post("/set-sys-config", (req, res) => {
  const {cfg} = req.body;
  try{
    SYS_CONFIG = {...SYS_CONFIG, ...cfg};
    res.send(SYS_CONFIG);
  } catch(e) {
    res.status(400).send("set-control, "+e.message);
  }
});
// ============== Control ===============
app.post("/set-control", (req, res) => {
  const {ctrl} = req.body;
  try{
    CTRL_SETUP = {...CTRL_SETUP, ...ctrl};
    res.send(CTRL_SETUP);
  } catch(e) {
    res.status(400).send("set-control, "+e.message);
  }
});
// ================= for chain node =================
const ConnectToChainNode = () => {
  try{
    fetch(`${SUPER_NODE}/chain-lists`)
    .then(results => results.json())
    .then(data => {
      if( data.chain ) {
        connectToPeers(data.chain[0].url);
      }
    }).catch(e => {

    });
  } catch(e) {
    console.log("ConnectToChainNode, ERROR : "+e);
  }
};

console.log("run Mode = "+EX);
if( EX === "SUPER") {
  const server = app.listen(NodePort, () => {
    console.log(`Node Running on port ${NodePort} ✅`);
  });
  startP2PServer(server);
  TaskDistribution();
} else {
  const server = app.listen(ChainNodePort, () => {
    // eslint-disable-next-line
    console.log(`Node Running on port ${ChainNodePort} ✅`);
  });
  startP2PServerLink(server);
  setTimeout(ConnectToChainNode, 1000);
}
// ----------------- task manager --------------------
let callCount = 0;
const CreateBlockTaskManager = async () => {
  const {CREATE_BLOCK_PERMISSION} = CTRL_SETUP;
  callCount++;
  if(CREATE_BLOCK_PERMISSION) {
    if(EX !== 'SUPER' && Math.floor(callCount % 4) === 0) {
      callCount = 0;
      const bPing = await pingNode(SUPER_NODE);
      if( !bPing ) {
        CTRL_SETUP.CREATE_BLOCK_PERMISSION = false;
        setTimeout( CreateBlockTaskManager, 500);
        return;
      }
    }
    checkMemPoolCreateNewBlock();
  }
  setTimeout( CreateBlockTaskManager, 500);
};

if(EX !== 'CHAIN') {
  setTimeout( CreateBlockTaskManager, 3000);
}

process.on("unhandledRejection", err => console.log("unhandledRejection : ", err));
