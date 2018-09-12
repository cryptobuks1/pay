import React, { Component } from "react";
import styled, { injectGlobal } from "styled-components";
import { HashRouter, Switch, Route } from "react-router-dom";
import reset from "styled-reset";
import typography from "./typography";
import Header from "Components/Header";
import Blocks from "Routes/Blocks";
import Home from "Routes/Home";
import Transactions from "Routes/Transactions";
import Download from "Routes/Download";
import Contact from "Routes/Contact";
import Block from "Routes/Block";
import Transaction from "Routes/Transaction";
import Address from "Routes/Address";

const baseStyles = () => injectGlobal`
  ${reset};
  ${typography};
  a{
    text-decoration:none;
    color:inherit;
  }
  h1,h2{
    margin:0!important;
  }
`;

const AppContainer = styled.div`
  background-color: #f2f6fa;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 50px;
`;

const Main = styled.main`
  max-width: 1000px;
  width: 100%;
  @media screen and (max-width: 600px) {
    width: 95%;
  }
`;

class App extends Component {
  render() {
    baseStyles();
    return (
      <HashRouter>
        <AppContainer>
          <Header />
          <Main>
            <Switch>
              <Route exact path={`/`} component={Home} />
              <Route exact path={`/blocks`} component={Blocks} />
              <Route exact path={`/transactions`} component={Transactions} />
              <Route exact path={`/download`} component={Download} />
              <Route exact path={`/contact`} component={Contact} />
              <Route path={`/blocks/:index`} component={Block} />
              <Route path={`/transactions/:id`} component={Transaction} />
              <Route path={`/addresses/:address`} component={Address} />
            </Switch>
          </Main>
        </AppContainer>
      </HashRouter>
    );
  }
}

export default App;
