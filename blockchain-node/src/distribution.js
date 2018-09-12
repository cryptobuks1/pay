const fetch = require("node-fetch");
const ChainNode = require("./chainnode");

const {getChainNodeList} = ChainNode;

const { 
  SUPER_NODE 
} = process.env;
  
let activeChainUrl = '';

const pingNode = async (url) => {
  try{
    const response = await fetch(`${url}/peerinfo`);
    return true;
  } catch(e) {
  }
  return false;
};

const SetCreatePermission = async (url, flag) => {
  try {
    const bodyData = await JSON.stringify({
      ctrl: {
        CREATE_BLOCK_PERMISSION: flag 
      }
    });
    const response = await fetch(`${url}/set-control`, {
      method: "POST",
      body: bodyData,
      headers: { "Content-Type": "application/json" }
    });
    return true;
  } catch (e) {
  }
  return false;
};

const DistributionPermission = async () => {
  const chain = getChainNodeList();
  const randomIndex = Math.floor(Math.random()*chain.length);

  if(chain[randomIndex].url !== activeChainUrl) {
    if(activeChainUrl.length > 0) {
      await SetCreatePermission(activeChainUrl, false);
      activeChainUrl = '';
      setTimeout( DistributionPermission, 1000);
      return;
    }
    activeChainUrl = chain[randomIndex].url;
    const bOn = await SetCreatePermission(activeChainUrl, true);
    if(!bOn) {
      await SetCreatePermission(SUPER_NODE, true);
      activeChainUrl = SUPER_NODE;
    }
  }
  setTimeout( DistributionPermission, 3000);
};

const TaskDistribution = () => {
  setTimeout( DistributionPermission, 10000);
};

module.exports = {
    pingNode,
    TaskDistribution
};
  