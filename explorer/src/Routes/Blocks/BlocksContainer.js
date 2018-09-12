import React, { Component } from "react";
import BlocksPresenter from "./BlocksPresenter";
import {withRouter} from "react-router-dom";

class BlocksContainer extends Component {
  state = {
    isLoading: true
  };

  componentDidMount = () => {
    const blockIndex = localStorage.getItem('blockIndex');
    this.props.history.push(`/blocks/${blockIndex}`);
  };
  componentWillUnmount(){
  }

  render() {
    return (
      <BlocksPresenter
        {...this.state}
      />
    );
  }
}

export default withRouter(BlocksContainer);
