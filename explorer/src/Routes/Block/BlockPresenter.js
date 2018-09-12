import React, { Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { makeSexyDate } from "../../utils";
import Transaction from "Components/Transaction";
import { Title, Key, SectionFlex, SectionName, SectionValue
 } from "Components/Shared";
import { Link } from "react-router-dom";

const BlockContainer = styled.div`
  margin-top: 20px;
`;

const Transactions = styled.div`
  width: 100%;
  border-radius: 10px;
  padding: 20px;
  margin-top: 25px;
  background-color: #ffffff;
  box-shadow: 0 1px 2px #c0c0c0, 0 1px 2px #c0c0c0;
`;

const Headers = styled.div`
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  padding-top: 20px;
  padding-bottom: 10px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  > * {
    width: 40%;
  }
  > *:nth-child(2) {
    width: 10%;
    color: inherit;
  }
  > *:last-child {
    width: 5%;
  }
`;

const Header = styled.span`
  font-weight: 600;
  text-align: center;
  color: ${props => props.theme.titleColor}!important;
`;

const SLink = styled(Link)`
  color: #fff;
`;

const ButtonHArea = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const ButtonConfirm = styled.div`
  margin-top: 20px;  
  padding: 12px 50px;
  text-align: center;
  background-color: #2196f3;
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  border-radius: 5px;
  box-shadow: 0 4px 6px #c0c0c0, 0 1px 3px #c0c0c0;
  transition: all 0.1s linear;
  cursor: pointer;
`;

const BlockPresenter = ({ isLoading, block }) => (
  <BlockContainer>
    {isLoading ? (
      <Title>Getting block</Title>
    ) : (
      <Fragment>
        <Title>Block index #: {block.index === 0 ? 'Genesis Block' : block.index}</Title>
        <SectionFlex>
          <SectionName>Hash:</SectionName>
          <SectionValue>{block.hash}</SectionValue>
        </SectionFlex>
        <SectionFlex>
          <SectionName>Previous Hash:</SectionName>
          <SectionValue>{block.previousHash}</SectionValue>
        </SectionFlex>
        <SectionFlex>
          <SectionName>Timestamp:</SectionName>
          <SectionValue>{makeSexyDate(block.timestamp)}</SectionValue>
        </SectionFlex>
        <Transactions>
          <Key>Transactions</Key>

          <Headers>
            <Header>From</Header>
            <Header>Amount</Header>
            <Header>To</Header>
            <Header>Timestamp</Header>
            <Header>Detail</Header>
          </Headers>

          {block.tx.map((tx, index) => (
            <Transaction
              from={tx.from}
              to={tx.to}
              amount={tx.amount}
              timestamp={tx.timestamp}
              key={index}
              id={tx.id}
            />
          ))}
        </Transactions>
        <ButtonHArea>
          <ButtonConfirm>
            <SLink to={`/`}>{'  확 인  '}</SLink>
          </ButtonConfirm>
        </ButtonHArea>      
      </Fragment>
    )}
  </BlockContainer>
);

BlockPresenter.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  block: PropTypes.object
};

export default BlockPresenter;
