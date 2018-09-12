import React, { Component } from "react";
import HomePresenter from "./HomePresenter";
import axios from "axios";
import { HTTP_URL, WS_URL } from "../../constants";
import { parseMessage } from "../../utils";

class HomeContainer extends Component {
  state = {
    isLoading: true,
    searchKey: "",
    errorMsg: null,
    searchBlock: null,
    searchTx: null,
    showModal: false,
    blockCount: 0,
    txCount: 0,
    txSum: 0,
    cbSum: 0,
    blocks: [],
    txs: [],
    socket: null
  };
  componentDidMount = () => {
    this._getHome();
    this._getInfos();
    
    const socket = new WebSocket(WS_URL);
    
    this.setState({ socket });

    socket.addEventListener("message", message => {
      const parsedMessage = parseMessage(message);
      if (parsedMessage !== null && parsedMessage !== undefined) {
        this._appendBlock(parsedMessage);
      }
    });
  };
  _appendBlock = parseDatas => {
    let addBlocks = [], addTxs = [];
    let txSum = 0, cbSum = 0, chk = 0;
    parseDatas.forEach(parseBlock => {
      chk = 0;
      this.state.blocks.forEach(block => {
        if(block.index === parseBlock.index){
          chk = 1;
        }
      });
      if(chk === 0){
        addBlocks.push(parseBlock);
        parseBlock.tx.forEach(tx => {
          addTxs.push(tx);
          if(tx.sym === 'GENT' && (tx.from === 'CREATE' || tx.from === 'COINBASE')) {
            cbSum += tx.amount;
          } else {
            txSum += tx.amount;
          }
        });
        const blockIndex = localStorage.getItem('blockIndex', 0);
        if(blockIndex < parseBlock.index) {
          localStorage.setItem('blockIndex', parseBlock.index);
        }
      }
    });

    this.setState(prevState => {
      return {
        ...prevState,
        blocks: [...addBlocks, ...prevState.blocks],
        txs: [...addTxs, ...prevState.txs],
        blockCount: prevState.blockCount+addBlocks.length,
        txCount: prevState.txCount+addTxs.length,
        txSum: prevState.txSum + txSum,
        cbSum: prevState.cbSum + cbSum
      };
    });
  }
  componentWillUnmount(){
    const {socket} = this.state;
    if(socket){
      socket.close();
    }
  }
 
  render() {
    return (
      <HomePresenter 
        {...this.state}
        onKeyDown={this.onKeyDown}
        handleKey={this._inputSearchKey}
        handleSubmit={this._submitSearchKey}
        closeModal={this._closeModal}
        >
      </HomePresenter>
    );
  }
  _getHome = async () => {
    try {
      const blockReq = await axios.get(`${HTTP_URL}/blocks/latest`);
      // const txReq = await axios.get(`${HTTP_URL}/transactions/latest`);
      const blocks = blockReq.data;
      // const txs = txReq.data;
      if(blocks) {
        if(blocks.length > 0) {
          localStorage.setItem('blockIndex', blocks[0].index);
        }
        this.setState({
          blocks,
          // txs,
          isLoading: false
        });
      }
    } catch(e) {
      console.log(e);
    }
  };
  _getInfos = async () => {
    try {
      const res = await axios.get(`${HTTP_URL}/status`);
      const {blockCount, txCount, txSum, cbSum} = res.data;
      this.setState({
        blockCount, txCount, txSum, cbSum
      });
    } catch(e) {
      console.log(e);
    }
  };
  onKeyDown = event => {
    // 'keypress' event misbehaves on mobile so we track 'Enter' key via 'keydown' event
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      this._submitSearchKey();
    }
  };  
  _inputSearchKey = event => {
    const { target: { value } } = event;
    this.setState({
      searchKey: value
    });
  };
  _submitSearchKey = async () => {
    const { searchKey } = this.state;
    if( searchKey.length < 1) return;

    try {
        const request = await axios.get(`${HTTP_URL}/search/${searchKey}`);
        const { block, tx } = request.data;
        if( block) {
          // 블록 표
          this.setState({
            searchBlock: block, 
            searchTx: null, 
            errorMsg: null,
            showModal: true});
        } else if(tx){
          this.setState({
            searchBlock: null, 
            searchTx: tx, 
            errorMsg: null,
            showModal: true});
        } else {
          this.setState({searchBlock: null, searchTx: null, errorMsg: '검색 결과가 없습니다.'});
        }
    } catch(e) {
      //this.props.alert.show('검색 결과 데이터가 없습니다.');
      //console.log("2:" + JSON.stringify(Alert));
      this.setState({errorMsg: '검색 결과가 없습니다.'});
      console.log(e);
    }
  };  
  _openModal = () => {
    this.setState({ showModal: true });
  };
  _closeModal = () => {
    this.setState({ showModal: false });
  };
}

export default HomeContainer;
