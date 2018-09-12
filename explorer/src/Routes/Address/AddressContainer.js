import React, { Component } from "react";
import axios from "axios";
import { HTTP_URL } from "../../constants";
import AddressPresenter from "./AddressPresenter";

class AddressContainer extends Component {
  state = {
    balance: [],
    blockIndex: 0,
    isLoading: true
  };
  componentDidMount = () => {
    const { match: { params: { address } } } = this.props;
    const blockIndex = localStorage.getItem('blockIndex');
    this.setState({
      blockIndex: blockIndex
    });
    this._getBalance(address);
  };
  render() {
    const { match: { params: { address } } } = this.props;
    const bSys = (address === 'CREATE' || address === 'COINBASE') ? true : false;
    return <AddressPresenter {...this.state} 
    address={bSys ? 'SYSTEM' : address} 
    />;
  }
  _getBalance = async address => {
    const bSys = (address === 'CREATE' || address === 'COINBASE') ? true : false;
    if(bSys) {
      this.setState({
        isLoading: false,
        balance: []
      });
      return;
    }
    try {
      const response = await axios.post(
        `${HTTP_URL}/balance`,
        { address },
        { headers: { 'Content-Type': 'application/json' } }
      );
      if(response && response.data && response.status === 200) { // response && response.data &&
        const {balance} = response.data;
        if(balance) {
          this.setState({
            isLoading: false,
            balance
          });
        }
      }
    } catch (e) {
      console.log(e);
    }
  };
}

export default AddressContainer;
