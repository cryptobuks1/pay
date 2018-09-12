import React, { Component } from "react";
import axios from "axios";
import { HTTP_URL, WS_URL } from "../../constants";
import { parseMessage } from "../../utils";
import TransactionsPresenter from "./TransactionsPresenter";
import {withRouter} from "react-router-dom";

class TransactionsContainer extends Component {
  state = {
    isLoading: true
  };

  componentDidMount = () => {
    const blockIndex = localStorage.getItem('blockIndex');
    this._getBlock(blockIndex);
  };
  componentWillUnmount(){
  }

  render() {
    return (
      <TransactionsPresenter
        {...this.state}
      />
    );
  }
  _getBlock = async index => {
    try {
      const request = await axios.get(`${HTTP_URL}/blocks/${index}`);
      const block = request.data;
      if(block) {
        if(block.tx.length > 0) {
          this.props.history.push(`/transactions/${block.tx[0].id}`);
          return;
        } 
      }
    } catch(e) {
      console.log(e);
    }
    this.props.history.push(`/blocks/${index}`);
  };
}

export default withRouter(TransactionsContainer);
