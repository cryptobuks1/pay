const WebSocket = require("ws"),
  fetch = require("node-fetch"),
  Mempool = require("./mempool");

const { getMemPool } = Mempool;

// We need to save the sockets somewhere
const sockets = [];

// Message Types
const GET_LATEST = "GET_LATEST";
const GET_ALL = "GET_ALL";
const GET_PAGE = "GET_PAGE";
const BLOCKCHAIN_RESPONSE = "BLOCKCHAIN_RESPONSE";
const REQUEST_MEMPOOL = "REQUEST_MEMPOOL";
const MEMPOOL_RESPONSE = "MEMPOOL_RESPONSE";
const PAGE_RESPONSE = "PAGE_RESPONSE";

const { 
  THIS_NODE,
  SUPER_NODE } = process.env;

// Message Creators
const getLatest = () => {
  return {
    type: GET_LATEST,
    data: null
  };
};

const getAll = () => {
  return {
    type: GET_ALL,
    data: null
  };
};
// 2018-07-22
const getPage = () => {
  const blocks = require("./blockchain").getBlockchain();
  return {
    type: GET_PAGE,
    data : blocks[blocks.length - 1].index
  };
};

const blockchainResponse = data => {
  return {
    type: BLOCKCHAIN_RESPONSE,
    data
  };
};
const pageResponse = data => {
  return {
    type: PAGE_RESPONSE,
    data
  };
};

const requestMempool = () => {
  return {
    type: REQUEST_MEMPOOL,
    data: null
  };
};

const mempoolResponse = data => {
  return {
    type: MEMPOOL_RESPONSE,
    data
  };
};

// Start the P2P Server
const startP2PServer = server => {
  const wsServer = new WebSocket.Server({ server });
  wsServer.on("connection", ws => {
    initConnection(ws);
  });
  // eslint-disable-next-line
  console.log(`Softcoin P2P Server ✅`);
};
const startP2PServerLink = server => {
  const wsServer = new WebSocket.Server({ server });
  wsServer.on("connection", ws => {
    initConnection(ws);
  });
  // eslint-disable-next-line
  console.log(`Softcoin P2P Server ✅`);
};
const startP2PServerPort = port => {
  const server = new WebSocket.Server({ port });
  server.on("connection", ws => {
    initConnection(ws);
  });
  // eslint-disable-next-line
  console.log(`Softcoin P2P Server Running on port ${port} ✅`);
};

// Getting the sockets
const getSockets = () => sockets;

// This fires everytime we add a new socket
const initConnection = socket => {
  sockets.push(socket);
  socketMessageHandler(socket);
  initError(socket);
  sendMessage(socket, getLatest());
  setTimeout(() => {
    sendMessageToAll(requestMempool());
  }, 500);
  socket.refreshIntervalID = setInterval(() => {
    if (sockets.includes(socket)) {
      sendMessage(socket);
    } else {
      if(socket.refreshIntervalID){
        clearInterval(socket.refreshIntervalID);
        socket.refreshIntervalID = null;
      }
    }
  }, 1000);
};
const initConnectionForChain = socket => {
  sockets.push(socket);
  console.log("P2P connected : " + sockets.length);
  socketMessageHandler(socket);
  sendMessage(socket, getLatest());
  setTimeout(() => {
    sendMessageToAll(requestMempool());
  }, 500);
  socket.refreshIntervalID = setInterval(() => {
    if (sockets.includes(socket)) {
      sendMessage(socket);
    } else {
      if(socket.refreshIntervalID){
        clearInterval(socket.refreshIntervalID);
        socket.refreshIntervalID = null;
      }
    }
  }, 1000);
};

// We use this to add peers
let reConnectPeer = null;
const reconnectToPeers = () => {
  if( reConnectPeer === null ) return;

  const filter = sockets.filter(socket => socket.peerName && (socket.peerName === reConnectPeer));
  if( filter && filter.length > 0) {
    console.log("already connected : " + filter[0].peerName);
    return;
  }

  setTimeout( () => {
    connectToPeers(reConnectPeer);
  }, 3000);
};

const addChainToMaster = () => {
  fetch(`${SUPER_NODE}/addChain`, {
    method: "POST",
    body: JSON.stringify({
      peer: THIS_NODE
    }),
    headers: { "Content-Type": "application/json" }
  }).catch(e => {});
};

const connectToPeers = newPeer => {
  const filter = sockets.filter(socket => socket.peerName && (socket.peerName === newPeer));
  if( filter && filter.length > 0) {
    console.log("connectToPeers, already connected : " + filter[0].peerName);
    return true;
  }

  reConnectPeer = newPeer;
  const ws = new WebSocket(newPeer);
  if( !ws || ws === undefined) {
    return false;
  }

  ws.on("open", () => {
    ws.peerName = reConnectPeer;
    initConnectionForChain(ws);
    addChainToMaster();
  });
  initErrorToReconnect(ws);
  return true;
};

// Parsing string to JSON
const parseMessage = data => {
  try {
    return JSON.parse(data);
  } catch (e) {
    return null;
  }
};

// Here we are gonna handle all the messages that our sockets get
const socketMessageHandler = ws => {
  ws.on("message", data => {
    try {
      const message = parseMessage(data);
      // Check if we get an empty message
      if (message === null) {
        return;
      }
      switch (message.type) {
      case GET_LATEST:
        sendMessage(ws, returnLatest());
        break;
      case GET_ALL:
        sendMessage(ws, returnAll());
        break;
      case GET_PAGE:
        sendMessage(ws, returnPage(message.data));
        break;
      case BLOCKCHAIN_RESPONSE:
        const receivedBlocks = message.data;
        handleBlockchainResponse(receivedBlocks);
        break;
      case PAGE_RESPONSE:
        const receivedPage = message.data;
        handlePageResponse(receivedPage);
        break;
      case REQUEST_MEMPOOL:
        sendMessage(ws, returnAllMempool());
        break;
        // eslint-disable-next-line
      case MEMPOOL_RESPONSE:
        const receivedPools = message.data;
        // If the mempool sends a null mempool
        if (receivedPools === null) {
          break;
        }
        receivedPools.forEach(pool => {
          try {
            require("./blockchain").handleIncomingPool(pool);
            broadcastMempool();
          } catch (e) {
            // console.log("socketMessageHandler, tx.id:"+tx.id);
          }
        });
        break;
      }
    } catch (e) {
      console.log("socketMessageHandler ERROR : " +e);
    }
  });
};

const sendMessage = (ws, message) => {
  if( ws && ws.readyState === WebSocket.OPEN) {
    try {
      ws.send(JSON.stringify(message));
    } catch(e) {
      console.log("sendMessage, ERROR..." + e);
    }
  }
};

const sendMessageToAll = message => 
  sockets.forEach(socket => sendMessage(socket, message));

const broadcastNewBlock = () => sendMessageToAll(returnLatest());

const returnLatest = () => {
  const newBlock = require("./blockchain").getNewestBlock();
  return blockchainResponse([newBlock]);
};

const returnAll = () => blockchainResponse(require("./blockchain").getBlockchain());
const returnPage = index => {
  const blocks = require("./blockchain").getBlockchain();
  let pageBlocks = [];
  for( let i=1; i < 501; i++){
    if( (index+i) < blocks.length) {
      pageBlocks.push(blocks[index+i]);
    } else {
      break;
    }
  }
  return pageResponse(pageBlocks);
};

const returnAllMempool = () => mempoolResponse(getMemPool());

const broadcastMempool = () => sendMessageToAll(returnAllMempool());

const handleBlockchainResponse = receivedBlocks => {
  // If the blockchain answers with no blocks break
  // Check if the blockchain size is bigger than zero
  if (receivedBlocks === null || receivedBlocks.length === 0) {
    return;
  }
  const latestBlockReceived = receivedBlocks[receivedBlocks.length - 1];
  // Validate the latest block structure on the chain
  if (!require("./blockchain").isBlockStructureValid(latestBlockReceived)) {
    console.log("The block structure is not valid");
    return;
  }
  // Get the newest block from the blockchain
  const newestBlock = require("./blockchain").getNewestBlock();
  /*
    Check if the index of the block we received is greater than the newest block in our blockchain
    This means that our blockchain is behind
   */

  if (latestBlockReceived.index > newestBlock.index) {
    /* 
        Check if the received block has the hash of hour newest block in his 'previousHash'.
        This will mean that our blockchain is only one block behind
      */

    if (newestBlock.hash === latestBlockReceived.previousHash) {
      // If we are only one block behind all we have to do is add it to our chain
      if (require("./blockchain").addBlockToChain(latestBlockReceived)) {
        sendMessageToAll(returnLatest());
      } else {
        console.log("addBlockToChain fail...");
      }
      // If we only got one block that is not only one block behind we have to get the whole blockchain
    } else if (receivedBlocks.length === 1) {
      // Send message to all sockets to get our blockchain
      sendMessageToAll(getPage());
    } else {
      require("./blockchain").replaceChain(receivedBlocks);
    }
  } else {
    // If we receive a blockchain but we are not behind it, we do nothing.
    return;
  }
};

const handlePageResponse = receivedBlocks => {
  if (receivedBlocks === null || receivedBlocks.length === 0) {
    return;
  }

  const firstBlockReceived = receivedBlocks[0];
  const latestBlockReceived = receivedBlocks[receivedBlocks.length - 1];
  // Validate the latest block structure on the chain
  if (!require("./blockchain").isBlockStructureValid(latestBlockReceived)) {
    console.log("The block structure is not valid");
    return;
  }
  // Get the newest block from the blockchain
  const newestBlock = require("./blockchain").getNewestBlock();

  if (firstBlockReceived.index > newestBlock.index) {
    if (newestBlock.hash === firstBlockReceived.previousHash) {
      if(require("./blockchain").replacePageChain(receivedBlocks)) {
        sendMessageToAll(getPage());
      }
    }
  }
};


const initError = ws => {
  const closeConnection = closedWs => {
    closedWs.close();
    // Remove the closed socket from our socket array
    sockets.splice(sockets.indexOf(closedWs), 1);
  };
  ws.on("close", () => closeConnection(ws));
  ws.on("error", () => closeConnection(ws));
};

const closeConnection = closedWs => {
  closedWs.removeAllListeners();
  try {
    closedWs.close();
    // Remove the closed socket from our socket array
    const index = sockets.indexOf(closedWs);
    if( index > -1) {
      sockets.splice(index, 1);
    }
  } catch(e) {
    console.log("closeConnection, ERROR : " + e);
  }
};
const initErrorToReconnect = ws => {
  const closeReConnection = closedWs => {

    closedWs.removeAllListeners();
    try {
      closedWs.close();
      // Remove the closed socket from our socket array
      const index = sockets.indexOf(closedWs);
      if( index > -1) {
        sockets.splice(index, 1);
      }
      reconnectToPeers();
    } catch(e) {
      console.log("closeReConnection, ERROR : " + e);
    }
  };
  ws.on("close", () => closeReConnection(ws));
  ws.on("error", (err) => {
    console.log("error: " + err);  
    closeReConnection(ws);
  });
};

const reconnectNode = () => {
  console.log("connected peer count : " + sockets.length);
  sockets.forEach(socket => {
    if( socket.peerName ) {
      console.log("connected peer name : " + socket.peerName);
    }
  });
  reconnectToPeers();
  return sockets.length;
};
const disconnectNode = (peerName) => {
  const filters = sockets.filter(socket => socket.peerName && (socket.peerName === peerName));
  if( filters && filters.length > 0) {
    filters.forEach(socket => {
      console.log("close socket : " + socket.peerName);
      closeConnection(socket);
    });
    return true;
  }
  console.log("not found peer : " + peerName);
  return false;
};

module.exports = {
  startP2PServer,
  startP2PServerPort,
  startP2PServerLink,
  connectToPeers,
  reconnectNode,
  disconnectNode,
  getSockets,
  broadcastNewBlock,
  broadcastMempool
};
