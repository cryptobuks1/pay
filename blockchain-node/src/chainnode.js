
const { 
  SUPER_NODE } = process.env;
  
class CHAIN {
  constructor(url, count, level, data) {
    this.url = url;
    this.count = count;
    this.level = level;
    this.data = data;
  }
}

const SuperNode = new CHAIN(SUPER_NODE, 0, "SUPER", "");

let ChainNodeList = [SuperNode];

const getChainNodeList = () => ChainNodeList;

const addChainNode = (url, level, data) => {
  if(ChainNodeList.findIndex(chain => chain.url === url) >= 0)
    return;
  const addChain = new CHAIN(url, 0, level, data);
  ChainNodeList.push(addChain);
};
const updateChainNode = (url, count, data = null) => {
  for(let chain of ChainNodeList){
    if( chain.url === url) {
      if(count <= 0) {
        chain.count = 0;
      } else {
        chain.count += count;
      }
      if(data) {
        chain.data = data; 
      }
      return;
    }
  }
};
    
const removeChainNode = (url) => {
  for(const chain of ChainNodeList){
    if( chain.url === url) {
      ChainNodeList.splice(ChainNodeList.indexOf(chain), 1);
      return;
    }
  }
};
  
module.exports = {
  getChainNodeList,
  addChainNode,
  updateChainNode,
  removeChainNode
};
  