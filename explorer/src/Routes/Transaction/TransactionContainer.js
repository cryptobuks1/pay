import React, { Component } from "react";
import axios from "axios";
import { HTTP_URL } from "../../constants";
import TransactionPresenter from "./TransactionPresenter";

class TransactionContainer extends Component {
  state = {
    blockIndex: 0,
    isLoading: true
  };
  componentDidMount = () => {
    const { match: { params: { id } } } = this.props;
    const blockIndex = localStorage.getItem('blockIndex');
    this.setState({
      blockIndex: blockIndex
    });
    this._getTx(id);
  };
  render() {
    return <TransactionPresenter {...this.state} />;
  }
  _getTx = async id => {
    try {
      const request = await axios.get(`${HTTP_URL}/transactions/${id}`);
      const tx = request.data;
      if(tx && tx.id) {
        this.setState({
          tx,
          isLoading: false
        });
      }
    } catch(e) {

    }
  };
}

export default TransactionContainer;
