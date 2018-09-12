import React, { Component } from "react";
import axios from "axios";
import { HTTP_URL } from "../../constants";
import BlockPresenter from "./BlockPresenter";

class BlockContainer extends Component {
  state = {
    isLoading: true
  };
  componentDidMount() {
    const { match: { params: { index } } } = this.props;
    this._getBlock(index);
  }
  render() {
    return <BlockPresenter {...this.state} />;
  }
  _getBlock = async index => {
    localStorage.setItem('blockIndex', index);
    try {
      const request = await axios.get(`${HTTP_URL}/blocks/${index}`);
      const block = request.data;
      if(block) {
        this.setState({
          block,
          isLoading: false
        });
      }
    } catch(e) {
      console.log(e);
    }
  };
}

export default BlockContainer;
